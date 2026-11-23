import { getSession } from "../../utils/getSession";

export interface InviteMemberParams {
  email: string;
  projectId: string;
}

export const inviteMemberAPI = async ({
  email,
  projectId,
}: InviteMemberParams) => {
  if (!email || !email.trim()) {
    throw new Error("Email address is required.");
  }

  if (!projectId || !projectId.trim()) {
    throw new Error("Project ID is missing or invalid.");
  }

  const session = await getSession();

  const appUrl =
    import.meta.env.VITE_APP_URL || window.location.origin;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;

  const payload = {
    p_email: email.trim(),
    p_project_id: projectId.trim(),
    p_app_url: appUrl,
    p_base_url: baseUrl,
  };

  const response = await fetch(
    `${baseUrl}/rest/v1/rpc/invite_member`,
    {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to send invitation.";
    try {
      const errorJson = await response.json();
      errorMessage =
        errorJson.message ||
        errorJson.error_description ||
        errorJson.details ||
        errorMessage;
    } catch {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  return true;
};

