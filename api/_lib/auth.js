import { supabaseAdmin } from './supabase-admin.js';

async function getAuthUser(req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) return null;
    return user;
}

// Shared method-check + auth preamble. Returns the user, or null after
// having already written the error response.
export async function requireUser(req, res, method) {
    if (req.method !== method) {
        res.status(405).json({ error: 'Method not allowed' });
        return null;
    }
    const user = await getAuthUser(req);
    if (!user) {
        res.status(401).json({ error: 'Non autenticato.' });
        return null;
    }
    return user;
}

export const siteUrl = process.env.VITE_SITE_URL || 'https://digitalands-v2.vercel.app';
