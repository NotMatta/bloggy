"use client"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { ProfileBlogsProvider } from "@/components/profile-blogs-provider"
import { LoadingScreen } from "@/components/loading-screen"

const SecureLayout = ({ children }) => {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <LoadingScreen message="Checking session..."/>
  if (!session){
    redirect("/login")
  }
  return (
    <div className="h-full flex flex-col">
      <ProfileBlogsProvider>
        {children}
      </ProfileBlogsProvider>
    </div>
  )
}

export default SecureLayout
