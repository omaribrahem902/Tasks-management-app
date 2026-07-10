import { supabase } from "../supabase-client";

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated.");
  }

  return session;
};