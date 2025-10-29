import prisma from "@/lib/prisma"

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true
    }
  })
}

export const getUserProjectsSummary = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,

      Workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          owner_id: true,
          created_at: true,

          _count: {
            select: {
              Task: true,
              WorkspaceMember: true
            }
          }
        },
        orderBy: { created_at: "desc" }
      }
    }
  })
}
