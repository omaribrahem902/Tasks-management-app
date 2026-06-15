import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewPasswordAPI } from "./createNewPasswordAPI";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import { createNewPasswordSchema } from "./createNewPasswordSchema";
import { useState } from "react";

type FormData = z.infer<typeof createNewPasswordSchema>;

const createNewPasswordFields: { label: string; id: keyof FormData }[] = [
  { label: "NEW PASSWORD", id: "password" },
  { label: "CONFIRM PASSWORD", id: "confirmPassword" },
];

const CreateNewPassword = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const hash = window.location.hash;
  console.log(hash);
  const params = new URLSearchParams(
    hash.substring(1)
  );

  const type = params.get("type");
  console.log("Type:", type);
  const accessToken =
    params.get("access_token");
  console.log("Access Token:", accessToken);

  const isValidRecovery =
    type === "recovery" &&
    !!accessToken;
  console.log("Is Valid Recovery:", isValidRecovery);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createNewPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: createNewPasswordAPI,
    onSuccess: () => {
      console.log("User logged in successfully");
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error: Error) => {
    console.log(error.message);
  },
  });

const onSubmit = async (data: FormData) => {
   mutation.mutate(data.password);
};

  // if (!isValidRecovery || !accessToken) {
  //   return (
  //     <p>
  //       Invalid or expired reset link.
  //     </p>
  //   );
  // }

  return (
    <section className=" flex justify-start flex-col w-xl max-w-xl bg-white p-6 md:p-12 rounded-lg">
      <h1 className="text-left mb-1.5 mt-9">Create New Password</h1>
      <p className="slate-2 body-md">
        please enter your details to access to your workspace
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6 mt-10"
      >
        {createNewPasswordFields.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            id={field.id}
            register={register}
            errors={errors}
          />
        ))}
        <button
          className="btn btn-custom"
          type="submit"
        >
          Update Password
        </button>
        <div className="center-flex gap-2">
          
            <a className="primary ml-1" href="/login">
              Back to login
            </a>
        </div>
        {showSuccess && (
          <div className="flex flex-col gap-6 mt-3 ">
            <div className="bg-[#82F9BE33] center-flex  gap-4 p-4 rounded-lg">
                <div className=" w-fit h-fit rounded-full bg-[#005235] p-1">  
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#82F9BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" data--h-bstatus="0OBSERVED"/></svg>
                </div>
                <p className="body-md text-[#005235]">Password updated successfully!</p>
            </div>
            <div>
                <div className="center-flex bg-[#F1F3FF] gap-2 py-3 mt-3 ">
                 <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2V0H12V2H6ZM8 13H10V7H8V13ZM9 21C7.76667 21 6.60417 20.7625 5.5125 20.2875C4.42083 19.8125 3.46667 19.1667 2.65 18.35C1.83333 17.5333 1.1875 16.5792 0.7125 15.4875C0.2375 14.3958 0 13.2333 0 12C0 10.7667 0.2375 9.60417 0.7125 8.5125C1.1875 7.42083 1.83333 6.46667 2.65 5.65C3.46667 4.83333 4.42083 4.1875 5.5125 3.7125C6.60417 3.2375 7.76667 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7625 14.3958 17.2875 15.4875C16.8125 16.5792 16.1667 17.5333 15.35 18.35C14.5333 19.1667 13.5792 19.8125 12.4875 20.2875C11.3958 20.7625 10.2333 21 9 21ZM9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19Z" fill="#737685"/>
                </svg>

                  <span>
                    you will be redirected to the login page in 3 seconds
                  </span>
                </div>
                
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default CreateNewPassword;

