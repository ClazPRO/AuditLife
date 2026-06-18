"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const supabase = createClient();
  
  // Register user, set email_confirm to false or handle it
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Assuming email confirmation is not strictly required for this test,
  // we might want to redirect to a confirmation page or dashboard directly.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function loginAsGuest(formData: FormData) {
  const nickname = formData.get("nickname") as string || "Anonymous";
  const randomSuffix = crypto.randomUUID().split('-')[0];
  const dummyEmail = `${nickname.replace(/\s+/g, '').toLowerCase()}_${randomSuffix}@guest.auditlife.app`;
  const dummyPassword = `Guest!${crypto.randomUUID()}#`;

  const supabase = createClient();
  
  const { error } = await supabase.auth.signUp({
    email: dummyEmail,
    password: dummyPassword,
    options: {
      data: {
        name: nickname,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
