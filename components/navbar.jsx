"use client"
import Logo from "@/public/logo.svg";
import { LogIn, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  CircleUserRound,
  Settings,
  LogOut,
  Info,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./mode-toggle";
import { LoaderCircle, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


const ProfileSheet = () => {
  const {data: session, isPending} = authClient.useSession();
  const queryClient = useQueryClient()
  const router = useRouter()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon"><Menu/></Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex gap-2">
            <img src={session ? session.user.image : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} className="w-12 h-12 rounded-full shrink-0 object-cover" />
            <div>
              <SheetTitle className="line-clamp-1">{session ? session.user.name : "Not Signed In"}</SheetTitle>
              {session && <span className="text-sm text-gray-500">{session.user.email}</span>}
            </div>
            <SheetDescription></SheetDescription>
          </div>
        </SheetHeader>
        {session ? <div className="flex flex-col gap-1 mt-2">
          <Button variant="navghost" onClick={() => router.push("/search")}><Search />Search</Button>
          <Separator/>
          <Button variant="navghost" onClick={() => router.push("/feed")}><LayoutDashboard />Feed</Button>
          <Button variant="navghost" onClick={() => router.push("/profile")}><CircleUserRound />Profile</Button>
          <Button variant="navghost" onClick={() => router.push("/settings")}><Settings />Settings</Button>
          <Separator/>
          <Button variant="navghost" onClick={() => router.push("/settings")}><Info />About us</Button>
          <Separator/>
          <Button variant="navghost" onClick={async () => {
            toast.info("Signing out...");
            await authClient.signOut()
            router.push("/login")
            queryClient.removeQueries({ queryKey:["profileBlogs"], exact: true });
          }}><LogOut /> Sign out</Button>
        </div>: isPending ?
        <div className="flex justify-center items-center w-full h-full mt-2">
          <LoaderCircle className="animate-spin repeat-infinite"/>
        </div> :
        <div className="flex flex-col gap-2 mt-2">
          <Button variant="navghost" onClick={() => router.push("/search")}><Search />Search</Button>
          <Button variant="navghost" onClick={() => router.push("/login")}><LogIn /> Sign in</Button>
        </div>}
      </SheetContent>
    </Sheet>
  )
}


export const NavBar = () => {

  return (
    <nav className="flex justify-between items-center">
      <Link href="/"><Logo width={200} height={60} fill="#dc2626"/></Link>
      <div className="flex gap-2 items-center">
        <ModeToggle/>
        <ProfileSheet/>       
      </div>
    </nav>
  )
}
