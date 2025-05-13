import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase configuration
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);