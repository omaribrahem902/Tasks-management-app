import { supabase } from "../../supabase-client";

export const loginAPI = async (data: {
  email: string;
  password: string;
}) => {
  const { data: userData, error } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (error) {
    throw new Error(error.message);
  }
    localStorage.setItem("token", userData.session.access_token);


  return userData;
};