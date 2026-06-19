import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kwmgxrlemrvllnxdncwu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZPcdSnr9myKqsLRJ4cUgYQ_u4CpNdg7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
