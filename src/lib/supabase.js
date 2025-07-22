import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TU_PROYECTO.supabase.co'
const supabaseKey = 'TU_PUBLIC_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
