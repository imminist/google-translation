import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bjejatntpazpitsxwhzi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZWphdG50cGF6cGl0c3h3aHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwNDUzOTcsImV4cCI6MjAzNzYyMTM5N30.KKpkPvvp4nkyhGgtW9URNJChITCGP2TbRkuBhxSlckU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
