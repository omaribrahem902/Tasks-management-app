import { supabase } from "../supabase-client";

export const getCurrentUser = async () => {
  const { data, error } =
    await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};