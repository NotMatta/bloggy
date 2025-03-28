"use client"
import { useParams, useRouter } from "next/navigation";
import { useIsRestoring, useQuery } from "@tanstack/react-query";
import { LoadingScreen } from "@/components/loading-screen";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateAgo } from "@/lib/utils";

const ProfilePage = () => {

  const { id } = useParams();
  const queryClient = useQueryClient()
  const router = useRouter()
  const isRestoring = useIsRestoring()
  const query = useQuery({
    queryKey:["profile", id], 
    queryFn:async () => {
      const response = await fetch(`/api/profile?id=${id}`)
      if(!response.ok){
        throw new Error("Error loading profile")
      }
      const profile = await response.json()
      return {...profile, fetchedAt: Date.now()}
    }
  })

  if(query.isLoading || isRestoring) return <LoadingScreen message="Loading profile..."/>
  if(query.isError) return <div>Error loading profile</div>
  if(query.isSuccess){
    query.data.blogs.map(blog => {
      queryClient.setQueryData(["blog", blog.id], {
        ...blog,
        fetchedAt: Date.now(),
        author: {
          name: query.data.name,
          email: query.data.email,
          image: query.data.image
        }
      })
    })
  }
  return (
    <div className="h-0 flex-grow overflow-y-scroll space-y-4">
      <div className="w-full h-[200px] relative border-b mb-20 shrink-0">
        {((query.data.fetchedAt + 1000 * 60 * 3) < Date.now()) && <Button variant="outline" className="absolute top-2 right-2" onClick={query.refetch} disabled={query.isRefetching}><RefreshCw/> Refresh</Button>}
        <div className="absolute flex flex-col justify-center items-center w-full -bottom-16">
          <img src={query.data.image} className="w-32 h-32 rounded-full shrink-0 object-cover"/>
          <h1 className="text-xl font-semibold">{query.data.name}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {query.data.blogs.map(blog => (
          <div key={blog.id} className="border rounded-xl p-4 group cursor-pointer" onClick={() => router.push("/blog/"+blog.id)}>
            <h2 className="flex-grow font-bold text-xl underline">{blog.title}</h2>
            <p>{formatDateAgo(blog.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfilePage;
