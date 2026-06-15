import { supabase } from "../../supabase-client";

export const createNewPasswordAPI = async (
  password: string
) => {
  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};