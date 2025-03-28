"use client"
import { SignUpForm } from "@/components/signup-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SignupPage = () => {
  const [disabled, setDisabled] = useState(false)
  const queryClient = useQueryClient()
  const handleSignup = async (credentials) => {
    toast.info("Creating accounts with email is disabled for now")
    return
    const { email, password, name} = Object.fromEntries(credentials)
    await authClient.signUp.email({email, password, name,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
    },{
      onSuccess: () => {
        queryClient.removeQueries({ queryKey:["profileBlogs"], exact: true });
        toast("Account created successfully");
      },
      onError: (ctx) => {
        toast("An error occurred",{
          description: ctx.error.message,
          variant: "destructive"
        });
        setDisabled(false);
      },
      onRequest: () => {
        setDisabled(true);
        toast("Creating an account...");
      }
    });
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <SignUpForm action={handleSignup} disabled={disabled}/>
    </div>
  );
}

export default SignupPage;
