/**
 * Technical Support Tickets — POST /api/v1/support/tickets (multipart/form-data)
 */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const TICKETS_URL = `${(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}/api/v1/support/tickets`;

function parseApiError(data, fallback) {
    if (!data) return fallback;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
        return data.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
    }
    if (data.detail?.message) return data.detail.message;
    if (data.error) return data.error;
    if (data.message) return data.message;
    return fallback;
}

/**
 * @param {{ name: string, email: string, contact_no: string, description: string, image?: File|null }} payload
 */
export async function createSupportTicket(payload) {
    const name = String(payload?.name || '').trim();
    const email = String(payload?.email || '').trim().toLowerCase();
    const contactNo = String(payload?.contact_no || '').trim();
    const description = String(payload?.description || '').trim();
    const image = payload?.image || null;

    if (!name) throw new Error('Full name is required.');
    if (!email || !email.includes('@')) throw new Error('A valid email address is required.');
    if (!contactNo || contactNo.length < 4) throw new Error('A valid contact number is required.');
    if (!description || description.length < 10) {
        throw new Error('Please describe the issue in at least 10 characters.');
    }

    if (image) {
        if (!(image instanceof File)) throw new Error('Invalid attachment file.');
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
            throw new Error('Attachment must be a JPEG, PNG, WebP, or GIF image.');
        }
        if (image.size > MAX_IMAGE_BYTES) {
            throw new Error('Attachment must be 5 MB or smaller.');
        }
    }

    const formData = new FormData();
    formData.append('project_id', String(payload?.project_id ?? 1));
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contact_no', contactNo);
    formData.append('description', description);
    if (image) {
        formData.append('image', image, image.name || 'screenshot.png');
    }

    const headers = {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let res;
    try {
        res = await fetch(TICKETS_URL, {
            method: 'POST',
            headers,
            body: formData,
        });
    } catch (netErr) {
        console.error('Support ticket network error:', netErr);
        throw new Error('Could not reach the support desk. Please check your connection and try again.');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(parseApiError(data, 'Failed to submit support ticket.'));
        err.status = res.status;
        err.raw = data;
        throw err;
    }

    return data;
}

export const supportTicketLimits = {
    maxImageBytes: MAX_IMAGE_BYTES,
    allowedImageTypes: ALLOWED_IMAGE_TYPES,
};
