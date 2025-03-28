import { prisma } from "@/prisma/prisma"

export const GET = async (req) => {
  const search = new URL(req.url).searchParams.get("q")
  if(!search){
    return Response.json({error: "Missing required fields"}, {status: 400})
  }
  try{
    if(search.length < 3){
      return Response.json({error: "Search query too short"}, {status: 400})
    }
    const blogs = await prisma.blog.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        title: true,
      }
    })
    const profiles = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true,
        image: true
      }
    })
    return Response.json({blogs, profiles})
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error :3",500)
  }
}

