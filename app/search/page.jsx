"use client"
import { LoadingScreen } from "@/components/loading-screen";
import { Input } from "@/components/ui/input";
import { useIsRestoring, useQueryClient } from "@tanstack/react-query"
import { UserRound } from "lucide-react";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react"
import { Search } from "lucide-react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SearchPage = () => {
  const queryClient = useQueryClient()
  const [cachedBlogs,setCachedBlogs] = useState(queryClient.getQueryCache().getAll().filter(query => query.queryKey[0] === "blog").map(query => query.state.data).filter(blog => blog))
  const [cachedProfiles,setCachedProfiles] = useState(queryClient.getQueryCache().getAll().filter(query => query.queryKey[0] === "profile").map(query => query.state.data).filter(profile => profile))
  const [searchResults, setSearchResults] = useState({blogs: cachedBlogs || [], profiles: cachedProfiles || []})
  const [searchKey, setSearch] = useState("")
  const [searchState, setSearchState] = useState("idle")
  const [page,setPage] = useState(1)
  const isRestoring = useIsRestoring()

  const filterOut = (q) => {
    const search = q.toLowerCase()
    const blogs = cachedBlogs.filter(blog => blog.title.toLowerCase().includes(search))
    const profiles = cachedProfiles.filter(profile => profile.name.toLowerCase().includes(search))
    setSearchResults({blogs,profiles})
  }
  
  const ExpandedSearch = async () => {
    if(searchState === "loading") return
    setSearchState("loading")
    if(searchKey.length < 3){
      toast.error("Search query too short")
      setSearchState("idle")
      return
    }
    const response = await fetch(`/api/search?q=${searchKey}`)
    if(!response.ok){
      toast.error("An error occurred")
      setSearchState("idle")
      return
    }
    const data = await response.json()
    const tempBlogs = cachedBlogs
    const tempProfiles = cachedProfiles
    data.blogs.map(blog => {
      if(!cachedBlogs.find(cached => cached.id === blog.id)){
        tempBlogs.push(blog)
      }
    })
    data.profiles.map(profile => {
      if(!cachedProfiles.find(cached => cached.id === profile.id)){
        tempProfiles.push(profile)
      }
    })
    setCachedBlogs(tempBlogs.filter(blog =>blog))
    setCachedProfiles(tempProfiles.filter(profile => profile))
    setSearchState("idle")
    filterOut(searchKey)
  }

  if(isRestoring) return <LoadingScreen message="Restoring..." />
    return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex gap-2">
        <Input placeholder="Search for blogs or profiles..." value={searchKey} onChange={(e) => {
          setSearch(e.target.value)
          filterOut(e.target.value)
        }}/>
      </div>
      {searchKey != "" && <div className="flex justify-center">{searchState === "loading" ? <Button variant="ghost" disabled><LoaderCircle className="repeat-infinite animate-spin"/></Button> :
        <Button variant="ghost" onClick={ExpandedSearch}><Search/>Expand Search</Button>
      }</div>}
      <div className="flex justify-between items-center">
        <p>{searchResults.blogs.length + searchResults.profiles.length} results found</p>
        <div className="flex items-center text-md gap-1">
          <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}><ChevronLeft/></Button>
          <p className="p-2">{page}</p>
          <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={(searchResults.blogs.length - page*10 < 10) && (searchResults.profiles.length - page*10) < 10}><ChevronRight/></Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold flex gap-2"><Newspaper/>Blogs:</h2>
        {searchResults.blogs.slice((page - 1) * 10, page * 10).map(blog => (
          <Link href={`/blog/${blog.id}`} key={blog.id} className="border p-2">
            <h3>{blog.title}</h3>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold flex gap-2"><UserRound/> Profiles</h2>
        {searchResults.profiles.slice((page - 1) * 10, page * 10).map(profile => (
          <Link href={`/profile/${profile.id}`} key={profile.id} className="border p-2">
            <h3>{profile.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
