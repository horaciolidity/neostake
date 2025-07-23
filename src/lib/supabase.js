import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxzvdktzsbuotuibrvik.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4enZka3R6c2J1b3R1aWJydmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTczOTcsImV4cCI6MjA2ODc5MzM5N30.L2G5X27IRBw5As78qEILDH0hRepCWiRD70scliIfCeo'

export const supabase = createClient(supabaseUrl, supabaseKey)
