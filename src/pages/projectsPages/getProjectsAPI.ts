import { supabase } from "../../supabase-client";

export const getProjectsAPI = async () => {
  const { data, error } = await supabase.rpc("get_projects");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};