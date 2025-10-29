import { Folder, MoreHorizontalIcon } from "lucide-react"
import { useFormatter, useNow, useTranslations } from "next-intl"
import Link from "next/link"

import { WorkspaceSummary } from "@/types/Workspace"
import { DeleteProjectDialog } from "@/web/components/customs/Dashboard/Projects/DeleteProjectDialog"
import {
  ProjectDialog,
  ProjectMode
} from "@/web/components/customs/Dashboard/Projects/ProjectDialog"
import { Button } from "@/web/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/web/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/web/components/ui/dropdown-menu"
import { useIsMobile } from "@/web/hooks/use-mobile"
import { routes } from "@/web/routes"

interface ProjectsCardProps {
  workspace: WorkspaceSummary
}

export function ProjectsCard({ workspace }: ProjectsCardProps) {
  const t = useTranslations()
  const format = useFormatter()
  const now = useNow()
  const isMobile = useIsMobile()

  return (
    <Card className="h-40 flex flex-col py-4">
      <CardHeader className="flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Folder className="h-5 w-5" aria-hidden="true" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="max-w-fit">
                <Button variant="ghost" size="icon" className="z-10 p-4">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="flex flex-col rounded-lg bg-background justify-start"
                align={isMobile ? "end" : "center"}
                sideOffset={2}
              >
                <ProjectDialog
                  userId={workspace.owner_id}
                  mode={ProjectMode.UPDATE}
                  project={workspace}
                />

                <DeleteProjectDialog userId={workspace.owner_id} projectId={workspace.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href={routes.workspace(workspace.slug)}
            className="text-lg font-semibold text-primary hover:underline hover:text-primary/80 transition-colors duration-200 cursor-pointer"
          >
            <CardTitle>{workspace.name}</CardTitle>
          </Link>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {t("Projects.membersNumber", { count: workspace._count.WorkspaceMember })}
        </span>
        <span className="text-sm text-muted-foreground">
          {format.relativeTime(workspace.created_at, now)}
        </span>
      </CardFooter>
    </Card>
  )
}
