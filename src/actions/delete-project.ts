"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { deleteWorkspace } from "@/lib/query/project-query"
import { routes } from "@/web/routes"

export async function deleteProjectAction(workspaceId: number) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session) {
    redirect(routes.auth.login.path)
  }

  try {
    await deleteWorkspace(workspaceId)
  } catch (err) {
    throw err
  }
}
