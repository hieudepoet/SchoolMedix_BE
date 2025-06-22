// config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const admin = createClient(supabaseUrl, serviceRoleKey); // full access
export const anon = createClient(supabaseUrl, anonKey);

// Optional exports
export const supabaseAdmin = admin.auth.admin;
export const supabaseClient = anon.auth;
