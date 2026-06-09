import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsotwinqhgmvbofoedhz.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_HKEbVhidSR5lK3Xn_vXKYw_QD6kVEu9'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_RW19drQStOSI_zzufQLehA_5KWk592J'

// Client-side Supabase client (uses anon/publishable key)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Server-side admin client (bypasses RLS) — server components + pipeline only
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
