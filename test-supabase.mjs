import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdwvnbkcwauixdfhoxkf.supabase.co';
const supabaseKey = 'sb_publishable_xhlylps_HBj1pbev1ivB4w_kglz18uJ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const res = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('Result:', res);
  } catch (err) {
    console.error('ERROR:', err.message || err);
  }
}

test();
