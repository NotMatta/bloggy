"use client"
import { authClient } from '@/lib/auth-client';
import { useQuery } from "@tanstack/react-query";
import { useEffect } from 'react';
import { createContext, useContext } from 'react';
import { LoadingScreen } from './loading-screen';
import { useQueryClient } from '@tanstack/react-query';
import { useIsRestoring } from '@tanstack/react-query';

const ProfileBlogsContext = createContext();

export const ProfileBlogsProvider = ({children}) => {
  const { data: session, isPending } = authClient.useSession()
  const queryClient = useQueryClient()
  const isRestoring = useIsRestoring()
  const query = useQuery({
    queryKey: ['profileBlogs'],
    queryFn: async () => {
      const response = await fetch('/api/profile-blogs')
      if (!response.ok) {
        throw new Error('Error loading blogs')
      }
      return response.json()
    },
    enabled: !!session && !isPending
  })
  if (query.isLoading || isPending || isRestoring) return <LoadingScreen message="Loading my blogs..."/>
  if (query.isError) return <div>Error loading blogs</div>
  if (query.isSuccess && query.data) {
    query.data?.map(blog => {
      queryClient.setQueryData(['blog', blog.id],
        {
          ...blog,
          author:{
            name: session.user.name,
            image: session.user.image
          },
          fetchedAt: Date.now()
        }
      )
      queryClient.setQueryData(['profile', session.user.id], () => {
        return {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          blogs: query.data,
          fetchedAt: Date.now()
        }
      })
    })
  }
  return (
    <ProfileBlogsContext.Provider value={query}>
      {children}
    </ProfileBlogsContext.Provider>
  );
}

export const useProfileBlogs = () => {
  const context = useContext(ProfileBlogsContext);
  if (context === undefined) {
    throw new Error('useProfileBlogs must be used within a ProfileBlogsProvider');
  }
  return context;
}
