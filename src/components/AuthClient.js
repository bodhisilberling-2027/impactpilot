'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthClient() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
    </div>
  );
}