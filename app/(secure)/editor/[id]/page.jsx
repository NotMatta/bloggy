"use client"
import { BlogEditor } from "@/components/blog-editor"
import { useProfileBlogs } from "@/components/profile-blogs-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { Save, Undo2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const BlogEditorPage = () => {
  const {id} = useParams()
  const blog = useProfileBlogs().data.find(blog => blog.id === id)
  const queryClient = useQueryClient()
  const [title,setTitle] = useState(blog?.title || "")
  const [content,setContent] = useState(blog?.content || "")
  const mutation = useMutation({
    mutationFn: async () => {
      if(title.length > 100){
        throw new Error("Title must be less than 100 characters")
      }
      if(title.length < 3){
        throw new Error("Title must be at least 3 characters")
      }
      toast.info("Updating blog...")
      const response = await fetch("/api/profile-blogs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id, title, content})
      })
      if(!response.ok){
        throw new Error("Error updating blog")
      }
      return response.json()
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["profileBlogs"], old => old.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
      queryClient.setQueryData(["blog", id], {...updatedBlog, fetchedAt: Date.now()})
      toast.success("Blog updated")
    },
    onError: (error) => {
      toast.error("An error occurred",{
        description: error.message,
        variant: "destructive"
      })
    }
  })
  if(!blog) return <div>Blog not found :)</div>
  return (
    <div className="flex flex-col gap-2 h-0 flex-grow">
      <div className="flex gap-2">
        <Link href="/profile"><Button size="icon" variant="outline" className="rounded-md"><ChevronLeft/></Button></Link>
        <Input placeholder="Title" value={title} onChange={e => {
          const tempTitle = e.target.value
          if(tempTitle.length > 100){
            toast.warning("Title must be less than 100 characters")
            return
          }
          setTitle(tempTitle)
        }}/>
        <Button size="icon"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || (title == blog.title && content == blog.content)}>
          {mutation.isPending ? <LoaderCircle className="animate-spin repeat-infinite"/> : <Save/>}
        </Button>
        <Button size="icon" variant="outline"
          onClick={() => {setTitle(blog.title);setContent(blog.content)}}
          disabled={mutation.isPending || (title == blog.title && content == blog.content)}>
          <Undo2/>
        </Button>
      </div>
      <BlogEditor value={{content,setContent}}/>
    </div>
  )
}

export default BlogEditorPage
