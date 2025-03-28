"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Edit, Plus } from "lucide-react";
import { Link as LinkIcon } from "@/components/link-icon";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useProfileBlogs } from "@/components/profile-blogs-provider";
import { PenSquare, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateAgo } from "@/lib/utils";



const AddBlog = () => {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")
  const mutation = useMutation({
    mutationFn: async () => {
      if(title.length > 100){
        throw new Error("Title must be less than 100 characters")
      }
      if(title.length < 3){
        throw new Error("Title must be at least 3 characters")
      }
      toast.info("Creating blog...")
      const response = await fetch("/api/profile-blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({title})
      })
      return response.json()
    },
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["profileBlogs"], old => [...old, newBlog])
      toast.success("Blog created")
    },
    onError: (error) => {
      toast.error("An error occurred",{
        description: error.message
      })
    }
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new blog</DialogTitle>
        </DialogHeader>
        
        {mutation.isSuccess ?
          <>
            <div>Blog created successfully</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => {mutation.reset(); setTitle("")}}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
          :<div className="flex gap-2">
            <Input placeholder="Title" value={title} onChange={e => {
              const tempTitle = e.target.value
              if(tempTitle.length > 100){
                toast.warning("Title must be less than 100 characters")
                return
              }
              setTitle(e.target.value)
            }}/>
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Create Blog</Button>
          </div>
        }
      </DialogContent>
    </Dialog>
  )  
}

const DeleteBlog = ({id}) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      toast.info("Deleting blog...")
      const response = await fetch("/api/profile-blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id})
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.setQueryData(["profileBlogs"], old => old.filter(blog => blog.id !== id))
      toast.success("Blog deleted")
    },
    onError: (error) => {
      toast.success("An error occurred",{
        description: error.message,
      })
    }
  })
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="wide" variant="navghost" className="w-full hover:bg-transparent"><Trash/> Delete</Button>
      </DialogTrigger>
      <DialogContent>
        {mutation.isSuccess ?
          <>
            <div>Blog deleted successfully</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </>:
          <>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this blog?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete the blog.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Delete Blog</Button>
            </DialogFooter>
        </>}
      </DialogContent>
    </Dialog>
  )
}

const Dropdown = ({id}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="border-none"><Ellipsis/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem><LinkIcon href={`/blog/${id}`}><Eye/>View</LinkIcon></DropdownMenuItem>
        <DropdownMenuItem><LinkIcon href={`/editor/${id}`}><PenSquare/>Edit</LinkIcon></DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DeleteBlog id={id}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ProfilePage = () => {
  const { data: session } = authClient.useSession() 
  const { data: profileBlogs} = useProfileBlogs()
  return (
    <div className="h-0 flex-grow overflow-y-scroll space-y-2">
      <div className="w-full h-[200px] relative border-b mb-16 shrink-0">
        <div className="absolute flex flex-col justify-center items-center w-full -bottom-16">
          <div className="relative w-32 h-32 overflow-hidden rounded-full group">
            <img src={session.user.image} className="w-full h-full object-cover"/>
            <Link
              href="/settings"
              className="bg-black opacity-0 duration-200 group-hover:opacity-50 absolute w-full h-full top-0 flex justify-center items-center text-white">
              <Edit size={48}/>
            </Link>
          </div>
          <h1 className="text-xl font-semibold">{session.user.name}</h1>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-end"><AddBlog/></div>
      </div>
      <div className="flex flex-col gap-2">
        {profileBlogs?.map(blog => (
          <div key={blog.id} className="border rounded-xl p-4 group">
            <div className="flex justify-between items-center gap-2">
              <div>
                <h2 className="font-bold line-clamp-1 text-xl underline">{blog.title}</h2>
                <p>{formatDateAgo(blog.createdAt)}</p>
              </div>
              <Dropdown id={blog.id}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
