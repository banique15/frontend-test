import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsiuakofodgkhmclfvpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXVha29mb2Rna2htY2xmdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NTg5OTgsImV4cCI6MjAxNTIzNDk5OH0.ty_9mqxxjK9itXEBCLrFzgtng1tFQGBMRLSwodeGzVk';
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;
