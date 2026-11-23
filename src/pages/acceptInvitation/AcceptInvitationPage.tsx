import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabase-client";
import {
  acceptInvitationAPI,
  getInvitationErrorMessage,
} from "./acceptInvitationAPI";
import { tasklyIcon } from "../../assets/icons";

export const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = searchParams.get("token");

  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acceptedProject, setAcceptedProject] = useState<{
    id?: string;
  } | null>(null);

  // Check authentication session on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session && session.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email ?? null);
          setAuthChecking(false);
        } else {
          setIsAuthenticated(false);
          setAuthChecking(false);

          // If token is present, preserve invitation URL when redirecting to login
          if (token && token.trim()) {
            const redirectUrl = encodeURIComponent(`/invite?token=${token.trim()}`);
            navigate(`/login?redirect=${redirectUrl}`, { replace: true });
          }
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  const mutation = useMutation({
    mutationFn: () => {
      if (!token || !token.trim()) {
        throw new Error("Missing invitation token.");
      }
      return acceptInvitationAPI(token.trim());
    },
    onSuccess: (result) => {
      setErrorMessage(null);
      setAcceptedProject({ id: result.projectId });
      toast.success("Invitation accepted successfully.");

      // Invalidate project queries so user sees newly joined project
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["get_projects"] });

      // Redirect user after short delay for optimal feedback
      setTimeout(() => {
        if (result.projectId) {
          navigate(`/project/${result.projectId}/tasks`, { replace: true });
        } else {
          navigate("/project", { replace: true });
        }
      }, 1200);
    },
    onError: (error) => {
      const message = getInvitationErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    },
  });

  // 1. Loading authentication session state
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center surface-low p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-100">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-[#0052CC]"
          />
          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            Checking invitation...
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please wait while we verify your session.
          </p>
        </div>
      </div>
    );
  }

  // 2. Token is missing or invalid in URL
  if (!token || !token.trim()) {
    return (
      <div className="flex min-h-screen items-center justify-center surface-low p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertCircle size={30} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Invalid Invitation Link
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This invitation link is missing a valid token. Please check the
            invitation link in your email or contact the project admin to request
            a new invitation.
          </p>

          <div className="mt-6">
            <Link
              to="/project"
              className="btn flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold shadow-xs"
            >
              <span>Go to Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is unauthenticated (in case redirect hasn't completed or was blocked)
  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(`/invite?token=${token.trim()}`);
    return (
      <div className="flex min-h-screen items-center justify-center surface-low p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0052CC]">
            <Mail size={28} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Authentication Required
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You need to log in to accept this project invitation.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to={`/login?redirect=${redirectUrl}`}
              className="btn flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold shadow-xs"
            >
              Log in to Accept
            </Link>
            <Link
              to={`/signup?redirect=${redirectUrl}`}
              className="w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Success State after acceptance
  if (acceptedProject !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center surface-low p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Invitation Accepted!
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You have successfully joined the project. Redirecting to your
            workspace...
          </p>

          <div className="mt-6 flex justify-center">
            <Loader2 size={24} className="animate-spin text-[#0052CC]" />
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                if (acceptedProject.id) {
                  navigate(`/project/${acceptedProject.id}/tasks`, {
                    replace: true,
                  });
                } else {
                  navigate("/project", { replace: true });
                }
              }}
              className="text-xs font-semibold text-[#0052CC] hover:underline"
            >
              Click here if you are not redirected automatically
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Normal Authenticated Accept Invitation State
  return (
    <div className="flex min-h-screen items-center justify-center surface-low p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 sm:p-10">
        {/* Top brand header */}
        <div className="flex items-center justify-center gap-2 text-slate-800">
          {tasklyIcon}
          <span className="text-sm font-bold tracking-wider">TASKLY</span>
        </div>

        {/* Hero badge */}
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-b from-[#003D9B] to-[#0052CC] text-white shadow-md">
            <Mail size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Project Invitation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You have been invited to join and collaborate on a project in Taskly.
          </p>
        </div>

        {/* User identity card */}
        {userEmail && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600">
            <UserCheck size={16} className="text-[#0052CC]" />
            <span>
              Signed in as{" "}
              <strong className="font-semibold text-slate-800">
                {userEmail}
              </strong>
            </span>
          </div>
        )}

        {/* Error alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 text-left"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Accept Button */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="btn flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold shadow-md transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Accepting invitation...</span>
              </>
            ) : (
              <span>Accept Invitation</span>
            )}
          </button>

          <Link
            to="/project"
            className="block w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Decline or return to projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;

