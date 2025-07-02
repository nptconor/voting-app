import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://rdjikkoukowuxprmuyde.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkamlra291a293dXhwcm11eWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODMwMTksImV4cCI6MjA2NzA1OTAxOX0.EeyHABzdBsLTMABzW-bdEHlhBYR7LbGR2XuqCZJySXU';

export const supabase = createClient(supabaseUrl, supabaseKey);
