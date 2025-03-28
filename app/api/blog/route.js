import { prisma } from "@/prisma/prisma";

export const GET = async (req) => {
  const id = new URL(req.url).searchParams.get("id")
  if(!id){
    return Response.json({error: "Missing required fields"}, {status: 400})
  }
  try{
    const blog = await prisma.blog.findFirst({
      where: {
        id
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true
          }
        }
      }
    })
    if(!blog){
      return Response.json({error: "Blog not found"}, {status: 404})
    }
    return Response.json(blog)
  }catch(e){
    return Response.json({error: "Internal server error"}, {status: 500})
  }
}
