import { getSession } from "../../utils/getSession";

export interface AcceptInvitationResult {
  projectId?: string;
}

interface PostgrestErrorBody {
  message?: string;
  error_description?: string;
  details?: string;
  hint?: string;
  code?: string;
}

export class InvitationAPIError extends Error {
  status?: number;
  responseBody?: unknown;

  constructor(message: string, status?: number, responseBody?: unknown) {
    super(message);
    this.name = "InvitationAPIError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export const acceptInvitationAPI = async (
  token: string
): Promise<AcceptInvitationResult> => {
  if (!token || !token.trim()) {
    throw new InvitationAPIError("Invitation token is required.", 400);
  }

  const session = await getSession();
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${baseUrl}/rest/v1/rpc/accept_invitation`,
    {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_API_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_token: token.trim(),
      }),
    }
  );

  if (!response.ok) {
    let errorData: PostgrestErrorBody | string | null = null;
    let message = "Failed to accept invitation.";

    try {
      errorData = (await response.json()) as PostgrestErrorBody;
      message =
        errorData?.message ||
        errorData?.error_description ||
        errorData?.details ||
        message;
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
        errorData = text;
      }
    }

    throw new InvitationAPIError(message, response.status, errorData);
  }

  // Attempt to extract projectId from response if present
  let projectId: string | undefined = undefined;
  try {
    const text = await response.text();
    if (text) {
      try {
        const data = JSON.parse(text);
        if (typeof data === "string" && data.length > 0) {
          projectId = data;
        } else if (typeof data === "object" && data !== null) {
          projectId =
            data.project_id ||
            data.projectId ||
            data.id ||
            data.p_project_id;
        }
      } catch {
        if (text.trim() && !text.includes("<") && text.length < 100) {
          projectId = text.trim();
        }
      }
    }
  } catch {
    // Response had no body or could not be read
  }

  return { projectId };
};

export const getInvitationErrorMessage = (
  error: unknown
): string => {
  if (error instanceof InvitationAPIError) {
    const rawMessage = (error.message || "").toLowerCase();
    const status = error.status;

    if (
      status === 401 ||
      rawMessage.includes("unauthorized") ||
      rawMessage.includes("not authenticated") ||
      rawMessage.includes("jwt")
    ) {
      return "You need to log in to accept this invitation.";
    }

    if (rawMessage.includes("expired")) {
      return "This invitation has expired. Please contact the project admin to request a new invitation.";
    }

    if (
      rawMessage.includes("invalid") ||
      rawMessage.includes("not found") ||
      rawMessage.includes("already accepted") ||
      rawMessage.includes("does not exist") ||
      status === 404
    ) {
      return "This invitation link is invalid. Please contact the project admin to request a new invitation.";
    }

    return "Something went wrong while accepting the invitation. Please try again.";
  }

  if (error instanceof Error) {
    const rawMessage = error.message.toLowerCase();
    if (rawMessage.includes("expired")) {
      return "This invitation has expired. Please contact the project admin to request a new invitation.";
    }
    if (rawMessage.includes("invalid") || rawMessage.includes("not found")) {
      return "This invitation link is invalid. Please contact the project admin to request a new invitation.";
    }
  }

  return "Something went wrong while accepting the invitation. Please try again.";
};
