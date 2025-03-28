import { auth } from "@/auth"
import { headers } from "next/headers"
import { prisma } from "@/prisma/prisma"

const middleware = async (next) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session){
    return Response.json({error: "Unauthorized"}, {status: 401})
  }
  return next()
}

export const GET = async () => {
  return middleware(async () => {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      select:{
        id: true,
        title: true,
        createdAt: true
      }
    })
    return Response.json(blogs)
  })
}
