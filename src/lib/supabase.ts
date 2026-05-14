import { createClient } from "@supabase/supabase-js";

// These are public/anon keys — safe to expose in client-side code.
// Using string literals avoids tsconfig module-mode conflicts with import.meta.
const SUPABASE_URL = "https://grlhiuvkwzopxawbctpa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5-VxUACW1PViH0W8ll5JQg_v565efNu";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type BloomRow = {
  id: number;
  name: string;
  flower: string;
  message: string;
  date: string;
  visitor_num: string;
  x: number;
  y: number;
  created_at: string;
};
