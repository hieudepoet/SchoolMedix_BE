import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export const supabaseAdmin = admin.auth.admin;

// Khởi tạo client với anon key (quyền công khai)
export const supabaseClient = createClient(supabaseUrl, anonKey);