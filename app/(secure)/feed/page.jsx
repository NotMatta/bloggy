"use client"

import { useIsRestoring, useQuery} from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { LoadingScreen } from "@/components/loading-screen";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { formatDateAgo } from "@/lib/utils";

const Feed = () => {
  
  const { data: session, isPending } = authClient.useSession()
  const isRestoring = useIsRestoring()
  const router = useRouter()
  const query = useQuery({queryKey: ['feed'], queryFn: async () => {
    const response = await fetch('/api/feed')
    if (!response.ok) {
      throw new Error('Error loading feed')
    }
    const blogs = await response.json()
    return {blogs, fetchedAt: Date.now()}
  },
  enabled: !!session && !isPending
  })

  if (query.isLoading || isPending || isRestoring) return <LoadingScreen message="Loading feed..."/>
  if (query.isError) return <div>Error loading feed</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
       <h1 className="text-3xl font-bold">Feed</h1>
        {((query.data.fetchedAt + 1000 * 60 * 3) < Date.now()) && <Button variant="outline" onClick={query.refetch} disabled={query.isRefetching}><RefreshCw/> Refresh </Button>}
      </div>
      <p className="text-accent-foreground">Check out the latest blogs from your friends</p>
      <div className="flex flex-col gap-2">
        {query.data.blogs.map(blog => (
          <div key={blog.id} className="w-full p-2 border rounded-xl cursor-pointer" onClick={() => router.push(`/blog/${blog.id}`)}>
            <h2 className="text-underline font-bold text-xl line-clamp-2">{blog.title}</h2>
            <p>{formatDateAgo(blog.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
