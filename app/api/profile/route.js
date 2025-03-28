import { prisma } from "@/prisma/prisma";

export const GET = async (req) => {
  const id = new URL(req.url).searchParams.get("id")
  if(!id){
    return Response.json({error: "Missing required fields"}, {status: 400})
  }
  try{
    const profile = await prisma.user.findFirst({
      where:{id},
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        blogs: {
          select: {
            id: true,
            authorId: true,
            title: true,
            content: true,
            createdAt: true
          }
        }
      }
    })
    if(!profile){
      return Response.json({error: "Profile not found"}, {status: 404})
    }
    return Response.json(profile)
  }catch(e){
    console.log(e)
    return Response.json({error: "Internal server error"}, {status: 500})
  }
}
