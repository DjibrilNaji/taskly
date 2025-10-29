"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { updateWorkspace } from "@/lib/query/project-query"
import { ProjectType } from "@/types/formTypes"
import { routes } from "@/web/routes"

export async function updateProjectAction(workspaceId: number, data: ProjectType) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session) {
    redirect(routes.auth.login.path)
  }

  try {
    await updateWorkspace(workspaceId, data)
  } catch (err) {
    throw err
  }
}
