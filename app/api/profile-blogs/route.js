import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { headers } from "next/headers"

const middleware = async (next) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session){
    return Response.json({error: "Unauthorized"}, {status: 401})
  }
  return next(session)
}

export const GET = async () => {
  return middleware(async (session) => {
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: session.user.id
      }
    })
    return Response.json(blogs)
  })
}

export const POST = async (req) => {
  return middleware(async (session) => {
    const {title} = await req.json()
    if(!title || title.length < 3 || title.length > 100){
      return Response.json({error: "Invalid title"}, {status: 400})
    }
    const blog = await prisma.blog.create({
      data: {
        title,
        content: "",
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })
    return Response.json(blog)
  })
}

export const PUT = async (req) => {
  return middleware(async (session) => {
    const {id, title, content} = await req.json()
    if(!id || !title || content == undefined || title.length < 3 || title.length > 100){
      return Response.json({error: "Missing required fields or invalid title"}, {status: 400})
    }
    const blog = await prisma.blog.update({
      where: {
        id,
        authorId: session.user.id
      },
      data: {
        title,
        content
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })
    return Response.json(blog)
  })
}

export const DELETE = async (req) => {
  return middleware(async (session) => {
    const {id} = await req.json()
    if(!id){
      return Response.json({error: "Missing required fields"}, {status: 400})
    }
    await prisma.blog.delete({
      where: {
        id,
        authorId: session.user.id
      }
    })
    return Response.json({message: "Blog deleted"})
  })
}
