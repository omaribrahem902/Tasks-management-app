import { supabase } from "../../supabase-client";

export const signUpAPI = async (data: {
  email: string;
  password: string;
  data: {
    name: string;
    job_title: string;
  };
}) => {
  const { data: resData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.data.name,
        job_title: data.data.job_title,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }


  return resData;
};