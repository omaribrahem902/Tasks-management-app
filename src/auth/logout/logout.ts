import { supabase } from "../../supabase-client";

export const logoutAPI = async () => {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);

  }

  localStorage.clear();
};