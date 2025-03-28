"use client"
import { LoginForm } from "@/components/login-form"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

const LoginPage = () => {
  const queryClient = useQueryClient()
  const [disabled, setDisabled] = useState(false)
  const handleLogin = async (credentials) => {
    const { email, password } = Object.fromEntries(credentials)
    await authClient.signIn.email({email, password},{
      onSuccess: () => {
        queryClient.removeQueries({ queryKey:["profileBlogs"], exact: true });
        toast.success("Logged in successfully");
      },
      onError: (ctx) => {
        console.log(ctx)
        toast.error("An error occurred",{
          description: ctx.error.message,
        });
        setDisabled(false);
      },
      onRequest: () => {
        setDisabled(true);
        toast.info("Logging in...");
      }
    });
  }
  return(
    <div className="w-full h-full flex justify-center items-center">
      <LoginForm action={handleLogin} disabled={disabled}/>
    </div>
  )
}

export default LoginPage
