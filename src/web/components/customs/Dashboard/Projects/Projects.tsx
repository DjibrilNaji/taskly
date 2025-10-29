"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import { AppSidebarHeader } from "@/web/components/customs/Dashboard/AppSidebar/AppSidebarHeader"
import { AppSidebarSkeleton } from "@/web/components/customs/Dashboard/AppSidebar/AppSidebarSkeleton"
import { NoProject } from "@/web/components/customs/Dashboard/Projects/NoProject"
import {
  ProjectDialog,
  ProjectMode
} from "@/web/components/customs/Dashboard/Projects/ProjectDialog"
import { ProjectsCard } from "@/web/components/customs/Dashboard/Projects/ProjectsCard"
import { ErrorState } from "@/web/components/customs/Utils/ErrorState"
import { SidebarInset } from "@/web/components/ui/sidebar"
import { projectService } from "@/web/services/projects-service"

interface DashboardProps {
  userId: string
}

export function Projects({ userId }: DashboardProps) {
  const t = useTranslations()

  const {
    data: user,
    isPending,
    error
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => projectService.getById(userId),
    enabled: !!userId
  })

  if (isPending) {
    return <AppSidebarSkeleton />
  }

  if (error) {
    return <ErrorState message={t("ErrorState.dashboardMessage")} />
  }

  return (
    <SidebarInset>
      <AppSidebarHeader user={user} title={t("Projects.title")} />

      {user.Workspace && user.Workspace.length > 0 ? (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto px-4 flex flex-col py-2"
        >
          <ProjectDialog userId={user.id} mode={ProjectMode.CREATE} />

          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.Workspace.map((workspace) => (
              <ProjectsCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex h-full"
        >
          <NoProject userId={user.id} />
        </motion.div>
      )}
    </SidebarInset>
  )
}
