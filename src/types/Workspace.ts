import { Task } from "@/types/Task"

export type WorkSpace = {
  id: number
  name: string
  slug: string
  description: string
  owner_id: string
  created_at: string
  WorkspaceMember: WorkSpaceMember[]
  Task: Task[]
}

export type WorkSpaceMember = {
  user_id: string
  workspace_id: number
}

export type WorkspaceSummary = {
  id: number
  name: string
  slug: string
  description: string
  owner_id: string
  created_at: Date
  _count: {
    Task: number
    WorkspaceMember: number
  }
}
