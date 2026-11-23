import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "./signupSchema";
import { signUpAPI } from "./signupAPI";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import { getSafeRedirectUrl } from "../../utils/safeRedirect";

type FormData = z.infer<typeof signUpSchema>;

const signUpFields: { label: string; id: keyof FormData }[] = [
  { label: "NAME", id: "name" },
  { label: "EMAIL", id: "email" },
  { label: "JOB TITLE (OPTIONAL)", id: "jobTitle" },
  { label: "PASSWORD", id: "password" },
  { label: "CONFIRM PASSWORD", id: "confirmPassword" },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: signUpAPI,
    onSuccess: () => {
      console.log("User signed up successfully");
      const destination = redirectParam
        ? getSafeRedirectUrl(redirectParam)
        : "/";
      navigate(destination, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign up.");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
        job_title: data.jobTitle || "",
      },
    });
  };

  const loginLink = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <section className="flex justify-start md:justify-center md:items-center flex-col bg-white w-xl max-w-xl p-6 md:p-12 rounded-lg">
      <h1 className="mb-1.5">Create your workspace</h1>
      <p className="slate-2 body-md">
        Join the editorial approach to task management
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6 mt-10"
      >
        {signUpFields.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            id={field.id}
            type={
              field.id === "password" || field.id === "confirmPassword"
                ? "password"
                : "text"
            }
            register={register}
            errors={errors}
          />
        ))}
        <button
          className="btn btn-custom"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating Account..." : "Create Account"}
        </button>
        <div className="center-flex gap-2">
          <p>
            Already have an account?{" "}
            <Link className="primary" to={loginLink}>
              Log in
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUp;
