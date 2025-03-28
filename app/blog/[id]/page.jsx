"use client"
import { useParams } from "next/navigation";
import { useIsRestoring, useQuery } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import { LoadingScreen } from "@/components/loading-screen";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { formatDateAgo } from "@/lib/utils";

const MarkdownDisplay = ({ markdown }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}

const BlogPage = () => {
  const { id } = useParams();
  const query = useQuery({
    queryKey:["blog", id], 
    queryFn:async () => {
      const response = await fetch(`/api/blog?id=${id}`)
      if(!response.ok){
        throw new Error("Error loading blog")
      }
      const blog = await response.json()
      return {...blog, fetchedAt: Date.now()}
    }})
  const isRestoring = useIsRestoring()
  if(query.isLoading || isRestoring) return <LoadingScreen message="Loading blog..."/>
  if(query.isError) return <div>Error loading blog</div>
  const blog = query.data
  return (
    <div className="h-0 w-full flex-grow overflow-y-scroll flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold md:max-w-2/3 text-center">{blog?.title}</h1>
        <div className="flex gap-2 items-center justify-center">
          <p className="text-accent-foreground text-center">{formatDateAgo(blog?.createdAt)}</p>
          {blog.fetchedAt + 1000 * 60 * 5 < Date.now() && <Button variant="outline" onClick={query.refetch} disabled={query.isRefetching}><RefreshCw/> Refresh</Button>}
        </div>
        <Link href={`/profile/${blog.authorId}`} className="flex items-center justify-center gap-2 underline">
          <img src={blog?.author.image} className="w-8 h-8 rounded-full object-cover"/>
          <span>{blog?.author.name}</span>
        </Link>
      </div>
      <div className="markdown w-full">
        <MarkdownDisplay markdown={blog?.content}/>
      </div>
    </div>
  )
}

export default BlogPage;
