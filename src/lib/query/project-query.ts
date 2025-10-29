import prisma from "@/lib/prisma"

const slugify = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const createWorkspace = async (
  data: { name: string; description: string },
  userId: string
) => {
  await prisma.workspace.create({
    data: {
      name: data.name,
      description: data.description,
      slug: slugify(data.name),
      owner_id: userId
    }
  })
}

export const updateWorkspace = async (
  workspaceId: number,
  data: { name: string; description: string }
) => {
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: data.name,
      description: data.description,
      slug: slugify(data.name)
    }
  })
}

export const deleteWorkspace = async (workspaceId: number) => {
  await prisma.workspace.delete({ where: { id: workspaceId } })
}
