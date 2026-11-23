import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { inviteMemberAPI } from "./inviteMemberAPI";

const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const InviteMemberModal = ({
  isOpen,
  onClose,
  projectId,
}: InviteMemberModalProps) => {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleClose = useCallback(() => {
    setIsSuccess(false);
    setInvitedEmail("");
    setApiError(null);
    reset({ email: "" });
    onClose();
  }, [onClose, reset]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const mutation = useMutation({
    mutationFn: (data: InviteMemberFormData) =>
      inviteMemberAPI({
        email: data.email,
        projectId,
      }),
    onSuccess: (_, variables) => {
      setIsSuccess(true);
      setInvitedEmail(variables.email.trim());
      setApiError(null);
      toast.success("Invitation sent successfully.");
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
    onError: (error: Error) => {
      setApiError(error.message || "Failed to send invitation. Please try again.");
      toast.error(error.message || "Failed to send invitation.");
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: InviteMemberFormData) => {
    setApiError(null);
    mutation.mutate(data);
  };

  const handleInviteAnother = () => {
    setIsSuccess(false);
    setInvitedEmail("");
    setApiError(null);
    reset({ email: "" });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all sm:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0E8FF] text-[#0052CC]">
            <Mail size={22} />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="mt-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>

            <h2
              id="invite-modal-title"
              className="mt-4 text-xl font-semibold text-slate-900"
            >
              Invitation Sent!
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              An invitation email has been sent to{" "}
              <span className="font-semibold text-slate-800">
                {invitedEmail}
              </span>
              . They can join the project using the link in the email.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleInviteAnother}
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                Invite Another
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn w-full rounded-md px-4 py-2.5 text-sm font-medium text-white shadow-xs focus:outline-none cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="mt-4">
            <h2
              id="invite-modal-title"
              className="text-xl font-semibold text-slate-900"
            >
              Invite Project Member
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the email address of the person you want to invite to this
              project.
            </p>

            {apiError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <span>{apiError}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="invite-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Email Address
                </label>
                <input
                  id="invite-email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  autoFocus
                  disabled={mutation.isPending}
                  {...register("email")}
                  className={`mt-1.5 w-full rounded-md border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-xs transition-colors focus:bg-white focus:outline-none ${
                    errors.email
                      ? "border-red-400 bg-red-50/30 focus:border-red-500"
                      : "border-slate-300 focus:border-[#0052CC]"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#BA1A1A]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-none disabled:opacity-50 sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="btn flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white shadow-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Invitation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
