import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");

const getAuthHeaders = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";
  }
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
};

/**
 * Direct Supabase fallback to calculate aggregate stats from cregis_deposits
 */
async function fetchStatsFromSupabase() {
  const { data: deposits, error } = await supabase
    .from("cregis_deposits")
    .select("amount, status");

  if (error) throw error;

  const items = deposits || [];
  const totalOrders = items.length;

  let totalVolumeUsdt = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let failedOrders = 0;

  items.forEach((item) => {
    const amt = Number(item.amount) || 0;
    const s = (item.status || "").toUpperCase();
    if (s === "COMPLETED" || s === "PAID" || s === "SUCCESS") {
      completedOrders += 1;
      totalVolumeUsdt += amt;
    } else if (s === "WAITING_PAYMENT" || s === "CREATED" || s === "PENDING") {
      pendingOrders += 1;
    } else if (s === "FAILED" || s === "CANCELLED" || s === "EXPIRED") {
      failedOrders += 1;
    }
  });

  const successRate =
    totalOrders > 0
      ? Number(((completedOrders / totalOrders) * 100).toFixed(1))
      : 0;

  return {
    total_volume_usdt: totalVolumeUsdt,
    completed_orders: completedOrders,
    pending_orders: pendingOrders,
    failed_orders: failedOrders,
    total_orders: totalOrders,
    success_rate_percent: successRate,
  };
}

/**
 * Direct Supabase fallback to fetch paginated deposits from cregis_deposits
 */
async function fetchDepositsFromSupabase(queryParams = {}) {
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 20;

  let query = supabase
    .from("cregis_deposits")
    .select(
      `
      *,
      users (
        id,
        first_name,
        last_name,
        email,
        phone_number
      ),
      subscription_plans (
        id,
        name,
        price
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (queryParams.status && queryParams.status !== "ALL") {
    query = query.ilike("status", queryParams.status);
  }

  if (queryParams.chain && queryParams.chain !== "ALL") {
    query = query.ilike("chain", queryParams.chain);
  }

  if (queryParams.search && queryParams.search.trim()) {
    const q = queryParams.search.trim();
    query = query.or(
      `cregis_order_id.ilike.%${q}%,tx_hash.ilike.%${q}%,deposit_address.ilike.%${q}%,id.ilike.%${q}%`
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: deposits, error, count } = await query;
  if (error) throw error;

  const formattedItems = (deposits || []).map((item) => {
    const u = item.users;
    let userObj = null;
    if (u) {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email || "User";
      userObj = {
        id: u.id,
        full_name: fullName,
        email: u.email,
        phone_number: u.phone_number || null,
      };
    } else if (item.webhook_payload) {
      try {
        const rawData = item.webhook_payload.data;
        const parsed = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        if (parsed?.payer_email) {
          userObj = {
            id: item.user_id,
            full_name: parsed.payer_id || parsed.payer_email.split("@")[0],
            email: parsed.payer_email,
            phone_number: null,
          };
        }
      } catch (_) {}
    }

    const p = item.subscription_plans;
    let planObj = null;
    if (p) {
      planObj = {
        id: p.id,
        name: p.name,
        tier_level: p.tier_level || 1,
        price: p.price || null,
      };
    }

    return {
      id: item.id,
      user_id: item.user_id,
      plan_id: item.plan_id,
      amount: Number(item.amount) || 0,
      currency: item.currency || "USDT",
      chain: (item.chain || "TRON").toUpperCase(),
      cregis_order_id: item.cregis_order_id || `cregis_${item.id.slice(0, 8)}`,
      deposit_address: item.deposit_address || null,
      tx_hash: item.tx_hash || null,
      status: item.status || "CREATED",
      webhook_payload: item.webhook_payload || null,
      created_at: item.created_at,
      completed_at: item.completed_at || null,
      users: userObj,
      subscription_plans: planObj,
    };
  });

  return {
    items: formattedItems,
    total: count || formattedItems.length,
    page,
    limit,
  };
}

/**
 * 1. Fetch Deposit Stats
 * Endpoint: GET /api/v1/admin/deposits/stats with fallback to Supabase
 */
export const fetchDepositStats = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/admin/deposits/stats`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data && typeof response.data.total_volume_usdt !== "undefined") {
      return response.data;
    }
  } catch (err) {
    console.warn("[adminDepositService] Backend stats API error, falling back to Supabase:", err?.message);
  }

  // Supabase fallback
  return await fetchStatsFromSupabase();
};

/**
 * 2. Fetch Deposits List with Pagination & Filters
 * Endpoint: GET /api/v1/admin/deposits with fallback to Supabase
 */
export const fetchDepositsList = async ({
  page = 1,
  limit = 20,
  status = "ALL",
  chain = "ALL",
  search = "",
} = {}) => {
  const params = { page, limit };
  if (status !== "ALL") params.status = status;
  if (chain !== "ALL") params.chain = chain;
  if (search && search.trim()) params.search = search.trim();

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/admin/deposits`, {
      headers: getAuthHeaders(),
      params,
    });
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data?.items) {
      return response.data;
    }
  } catch (err) {
    console.warn("[adminDepositService] Backend deposits API error, falling back to Supabase:", err?.message);
  }

  // Supabase fallback
  return await fetchDepositsFromSupabase({ page, limit, status, chain, search });
};

/**
 * 3. Fetch Single Deposit Detail & Webhook Audit Trail
 * Endpoint: GET /api/v1/admin/deposits/{deposit_id} with fallback to Supabase
 */
export const fetchDepositDetail = async (depositId) => {
  if (!depositId) throw new Error("depositId is required");

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/admin/deposits/${depositId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data?.id) {
      return response.data;
    }
  } catch (err) {
    console.warn("[adminDepositService] Backend deposit detail API error, falling back to Supabase:", err?.message);
  }

  // Supabase fallback
  const { data, error } = await supabase
    .from("cregis_deposits")
    .select(`
      *,
      users ( id, first_name, last_name, email, phone_number ),
      subscription_plans ( id, name, price )
    `)
    .eq("id", depositId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Status Badge Color Class Helper
 */
export const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    case "PAID":
    case "SUCCESS":
      return "badge-success";
    case "WAITING_PAYMENT":
    case "CREATED":
    case "PENDING":
      return "badge-warning";
    case "FAILED":
    case "CANCELLED":
    case "EXPIRED":
      return "badge-danger";
    default:
      return "badge-secondary";
  }
};
