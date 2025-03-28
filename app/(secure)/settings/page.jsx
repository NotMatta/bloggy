"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { UserRoundMinus } from "lucide-react";
import { PackageMinus } from "lucide-react";

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const [Name, setName] = useState(session.user.name)
  const [Image, setImage] = useState(session.user.image)
  const [disabled, setDisabled] = useState(false)
  const router = useRouter()
  const clearCache = () => {
    if(!confirm("Are you sure you want to clear your cache?")) return
    queryClient.clear()
    toast.success("Cache cleared")
    router.refresh()
  }
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <h2 className="text-xl mb-1">Profile</h2>
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <img src={Image} className="w-32 h-32 rounded-full shrink-0 object-cover"/>
        <div className="w-full flex flex-col items-center md:grid grid-rows-2 grid-cols-2 gap-2">
          <Input value={Name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
          <Button className="w-fit" disabled={disabled || Name == session.user.name}  onClick={async () => {
            setDisabled(true)
            await authClient.updateUser({name: Name})
            toast.success("Name updated")
            setDisabled(false)
          }}>Update Name</Button>
          <Input value={Image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL"/>
          <Button className="w-fit" disabled={disabled || Image == session.user.image} onClick={async () => {
            setDisabled(true)
            await authClient.updateUser({image: Image})
            toast.success("Image updated")
            setDisabled(false)
          }}>Update Image</Button>
        </div>
      </div>
      <h2 className="text-xl mb-1">Actions</h2>
      <div className="flex flex-col gap-2 w-fit">
        <Button onClick={clearCache}><PackageMinus/> Clear Cache</Button>
        <Button variant="destructive" onClick={async () => {
          if(!confirm("Are you sure you want to delete your account?")) return
          queryClient.removeQueries({ queryKey:["profileBlogs"], exact: true });
          toast.success("Signing out...")
          await authClient.deleteUser()
          toast.success("User deleted")
        }}><UserRoundMinus/> Delete Account</Button>
      </div>
    </div>
  );
}

export default SettingsPage;
