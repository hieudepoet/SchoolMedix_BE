import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

const admin = createClient(supabaseUrl, serviceRoleKey);
const anon = createClient(supabaseUrl, anonKey);

// Access auth admin api
export const supabaseAdmin = admin.auth.admin;
export const supabaseClient = anon.auth;