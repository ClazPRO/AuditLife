import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    
    if (!email || !password) {
      console.warn('Missing test credentials');
      return;
    }
    
    const res = await supabase.auth.signUp({
      email,
      password,
    });
    console.log('Result keys:', Object.keys(res).length);
  } catch (err) {
    console.error('ERROR:', err instanceof Error ? err.message : String(err));
  }
}

test();
