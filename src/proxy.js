import { NextResponse } from "next/server";
import { getMaintenanceStatus } from "@/lib/maintenanceService";

// Routes that require a logged-in user
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chart-scanner",
  "/trade-advisor",
  "/trade-audit",
  "/market-assistant",
  "/signal-terminal",
  "/live-scanner",
  "/strategy-core",
  "/trading-signal",
  "/strategy-signal",
  "/predefined-strategies",
  "/strategy-hub",
  "/my-bots",
  "/ai-bot-builder",
  "/manual-bot-builder",
  "/bot-library",
  "/browse-bots",
  "/calendar",
  "/calculator",
  "/news",
  "/tools",
  "/credit-history",
  "/broker",
  "/brokers",
  "/profile",
  "/settings",
  "/onboarding",
  "/steper",
];

// Auth routes — already-logged-in users should be bounced to /dashboard or their intended redirect
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Routes excluded from maintenance mode
const MAINTENANCE_EXCLUDED_PREFIXES = [
  "/_next",
  "/assets",
  "/icons",
  "/favicon",
  "/icon",
  "/sw.js",
  "/manifest",
  "/robots.txt",
  "/sitemap.xml",
  "/api/health",
  "/api/maintenance",
  "/maintenance",
];

// Language route aliases (e.g. /arabic, /spanish, /ar, /ru, /zh)
const LANGUAGE_ALIASES = {
  en: "en",
  english: "en",
  ar: "ar",
  arabic: "ar",
  ary: "ary",
  darija: "ary",
  moroccan: "ary",
  "moroccan-arabic": "ary",
  es: "es",
  spanish: "es",
  espanol: "es",
  ru: "ru",
  russian: "ru",
  zh: "zh",
  chinese: "zh",
  mandarin: "zh",
  vi: "vi",
  vietnamese: "vi",
  id: "id",
  indonesian: "id",
  fil: "fil",
  filipino: "fil",
  tagalog: "fil",
  ph: "fil",
};

export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Security: scrub any sensitive credentials (passwords, tokens) passed in URL query params
  if (
    searchParams.has("password") ||
    searchParams.has("new_password") ||
    searchParams.has("confirm_password") ||
    searchParams.has("confirmPassword") ||
    searchParams.has("pwd") ||
    searchParams.has("pass")
  ) {
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete("password");
    cleanUrl.searchParams.delete("new_password");
    cleanUrl.searchParams.delete("confirm_password");
    cleanUrl.searchParams.delete("confirmPassword");
    cleanUrl.searchParams.delete("pwd");
    cleanUrl.searchParams.delete("pass");
    cleanUrl.searchParams.delete("email");
    return NextResponse.redirect(cleanUrl);
  }

  // Early bypass for static PWA assets, service worker, manifest, and robots
  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const isLoggedIn = Boolean(token);

  // --- 1. Dynamic Maintenance Mode Check (Highest Priority) ---
  const maintenanceStatus = await getMaintenanceStatus();
  const isMaintenanceEnv =
    process.env.MAINTENANCE_MODE === "true" ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const forceMaintenanceCookie = request.cookies.get("tradermaster_maintenance")?.value === "true";
  const forceMaintenanceQuery = searchParams.get("force_maintenance") === "true";
  const isMaintenanceActive =
    maintenanceStatus.isActive ||
    isMaintenanceEnv ||
    forceMaintenanceCookie ||
    forceMaintenanceQuery;

  // Check Developer / Admin Bypass Key
  const bypassParam = searchParams.get("bypass_maintenance");
  const bypassCookie = request.cookies.get("maintenance_bypass")?.value;
  const validBypassSecret = process.env.MAINTENANCE_BYPASS_KEY || "TraderMaster-secret";
  const isBypassed =
    bypassCookie === "true" ||
    bypassCookie === validBypassSecret ||
    bypassParam === validBypassSecret ||
    bypassParam === "true";

  const isExcludedFromMaintenance = MAINTENANCE_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix)
  );

  // If site is in maintenance mode and not bypassed, immediately lock all routes
  if (isMaintenanceActive && !isBypassed && !isExcludedFromMaintenance) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Service Temporarily Unavailable",
          status: "maintenance",
          retryAfter: 120,
        },
        {
          status: 503,
          headers: {
            "Retry-After": "120",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.rewrite(maintenanceUrl, {
      status: 503,
      headers: {
        "Retry-After": "120",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  // --- 2. Language Path Prefix Detection & Normalization ---
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0]?.toLowerCase();
  const matchedLocale = LANGUAGE_ALIASES[firstSegment];
  const cookieLang = request.cookies.get("app_language")?.value || request.cookies.get("NEXT_LOCALE")?.value;
  const preferredLang = (cookieLang && LANGUAGE_ALIASES[cookieLang.toLowerCase()]) || null;

  let normalizedPathname = pathname;
  if (matchedLocale && !pathname.startsWith("/api/")) {
    const remainingSegments = pathSegments.slice(1);
    normalizedPathname = remainingSegments.length > 0 ? "/" + remainingSegments.join("/") : "/";
  }

  // If user has a non-en saved language preference in cookies, but hit a default /en/... route on refresh, bounce to preferred language
  if (matchedLocale === "en" && preferredLang && preferredLang !== "en" && !pathname.startsWith("/api/")) {
    const localizedPath = normalizedPathname === "/" ? `/${preferredLang}` : `/${preferredLang}${normalizedPathname}`;
    const redirectUrl = new URL(localizedPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  // If no locale prefix is present on a non-API route, redirect to include the active language (e.g. /ar/..., /es/...)
  if (!matchedLocale && !pathname.startsWith("/api/")) {
    const targetLang = preferredLang || "en";
    const localizedPath = pathname === "/" ? `/${targetLang}` : `/${targetLang}${pathname}`;
    const redirectUrl = new URL(localizedPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  const prefixLang = matchedLocale ? `/${matchedLocale}` : (preferredLang ? `/${preferredLang}` : "/en");

  // --- 3. Route Aliases & Standardizations ---
  if (normalizedPathname === "/broker") {
    return NextResponse.redirect(new URL(`${prefixLang}/brokers`, request.url));
  }
  if (normalizedPathname.startsWith("/broker/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/broker/", "/brokers/")}`, request.url));
  }
  if (normalizedPathname === "/tools") {
    return NextResponse.redirect(new URL(`${prefixLang}/calculator`, request.url));
  }
  if (normalizedPathname === "/strategy-hub/strategy") {
    return NextResponse.redirect(new URL(`${prefixLang}/strategy-signal`, request.url));
  }
  if (normalizedPathname === "/strategy-hub/live") {
    return NextResponse.redirect(new URL(`${prefixLang}/signal-terminal`, request.url));
  }
  if (normalizedPathname === "/strategy-hub" || normalizedPathname.startsWith("/strategy-hub/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/strategy-hub", "/strategy-core")}`, request.url));
  }
  if (normalizedPathname === "/ai-strategy-hub" || normalizedPathname.startsWith("/ai-strategy-hub/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/ai-strategy-hub", "/ai-trading-signal")}`, request.url));
  }
  if (normalizedPathname === "/ai-strategy-core" || normalizedPathname.startsWith("/ai-strategy-core/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/ai-strategy-core", "/ai-trading-signal")}`, request.url));
  }
  if (normalizedPathname === "/live-scanner" || normalizedPathname.startsWith("/live-scanner/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/live-scanner", "/signal-terminal")}`, request.url));
  }
  if (normalizedPathname === "/live-market-scanner" || normalizedPathname.startsWith("/live-market-scanner/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/live-market-scanner", "/signal-terminal")}`, request.url));
  }
  if (normalizedPathname === "/trade-audit" || normalizedPathname.startsWith("/trade-audit/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/trade-audit", "/trade-advisor")}`, request.url));
  }
  if (normalizedPathname === "/ai-trade-audit" || normalizedPathname.startsWith("/ai-trade-audit/")) {
    return NextResponse.redirect(new URL(`${prefixLang}${normalizedPathname.replace("/ai-trade-audit", "/ai-trade-advisor")}`, request.url));
  }
  if (
    normalizedPathname === "/predefine-strategy" ||
    normalizedPathname === "/predefined-strategy" ||
    normalizedPathname === "/predefine-strategies" ||
    normalizedPathname.startsWith("/predefine-strategy/") ||
    normalizedPathname.startsWith("/predefined-strategy/") ||
    normalizedPathname.startsWith("/predefine-strategies/")
  ) {
    return NextResponse.redirect(new URL(`${prefixLang}/predefined-strategies`, request.url));
  }

  // --- 4. Protected Route & Auth Redirections ---
  const isProtected = PROTECTED_PREFIXES.some((p) => normalizedPathname === p || normalizedPathname.startsWith(`${p}/`));
  const isAuthRoute = AUTH_ROUTES.some((p) => normalizedPathname === p || normalizedPathname.startsWith(`${p}/`));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL(`${prefixLang}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    let redirectTarget = request.nextUrl.searchParams.get("redirect") || `${prefixLang}/dashboard`;
    if (
      redirectTarget === "/onboarding" ||
      redirectTarget === "/steper" ||
      redirectTarget.startsWith("/onboarding") ||
      redirectTarget.startsWith("/steper")
    ) {
      redirectTarget = `${prefixLang}/dashboard`;
    }
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  // --- 5. Rewrite Localized Path to Canonical Next.js Page ---
  if (matchedLocale && !pathname.startsWith("/api/")) {
    const targetUrl = new URL(normalizedPathname, request.url);
    targetUrl.search = request.nextUrl.search;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tradermaster-lang", matchedLocale);

    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("app_language", matchedLocale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    response.cookies.set("NEXT_LOCALE", matchedLocale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    response.headers.set("x-tradermaster-lang", matchedLocale);
    return response;
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|favicon.svg|assets|icons|sw\\.js|manifest\\.json|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
};
