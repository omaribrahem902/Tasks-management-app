import { supabase } from "../../supabase-client";

export const forgotPasswordAPI = async (
  email: string
) => {
  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email
    );

  if (error) {
    throw new Error(error.message);
  }

  return data;
};