import { Folder } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  ProjectDialog,
  ProjectMode
} from "@/web/components/customs/Dashboard/Projects/ProjectDialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/web/components/ui/empty"

interface NoProjectProps {
  userId: string
}

export function NoProject({ userId }: NoProjectProps) {
  const t = useTranslations()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>

        <EmptyTitle>{t("Projects.noProjectsTitle")}</EmptyTitle>

        <EmptyDescription>{t("Projects.noProjects")}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex gap-2">
          <ProjectDialog userId={userId} mode={ProjectMode.CREATE} />
        </div>
      </EmptyContent>
    </Empty>
  )
}
