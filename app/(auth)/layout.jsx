"use client"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

const AuthLayout = ({ children }) => {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <div>Loading...</div>
  if (session){
    redirect("/feed")
  }
  return children
}

export default AuthLayout
