import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./loginSchema";
import { loginAPI } from "./loginAPI";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

type FormData = z.infer<typeof loginSchema>;

const loginFields: { label: string; id: keyof FormData }[] = [
  { label: "EMAIL", id: "email" },
  { label: "PASSWORD", id: "password" },
];

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: () => {
      console.log("User logged in successfully");
      navigate("/projects");
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      email: data.email,
      password: data.password
    });
    console.log(data);
    
  };

  return (
    <section className=" flex justify-start md:justify-center md:items-center flex-col w-xl max-w-xl bg-white p-6 md:p-12 rounded-lg">
      <h1 className="text-center mb-1.5 mt-20">Welcom Back</h1>
      <p className="text-center slate-2 body-md">
        please enter your details to access to your workspace
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6 mt-10"
      >
        {loginFields.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            id={field.id}
            register={register}
            errors={errors}
          />
        ))}
        <div className="flex justify-between">
          <div>
            <input type="checkbox" name="" id="" />
            <span className="body-md ml-2">Remember me</span>
          </div>
          <span onClick={()=> navigate("forgot-password")} className="body-md text-center primary cursor-pointer">Forgot your password?</span>
        </div>
        <button
          className="btn btn-custom"
          type="submit"
        >
          Log In
        </button>
        <div className="center-flex gap-2">
          <p>
            Dont have an account?
            <a className="primary ml-1" href="/signup">
              Signup
            </a>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;

