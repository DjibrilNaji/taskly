import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { createProjectAction } from "@/actions/create-projects"
import { updateProjectAction } from "@/actions/update-project"
import { projectFormSchema, ProjectType } from "@/types/formTypes"
import { WorkspaceSummary } from "@/types/Workspace"
import { Button } from "@/web/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/web/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/web/components/ui/form"
import { Input } from "@/web/components/ui/input"
import { Spinner } from "@/web/components/ui/spinner"
import { Textarea } from "@/web/components/ui/textarea"

export enum ProjectMode {
  CREATE = "create",
  UPDATE = "update"
}

interface ProjectDialogProps {
  userId: string
  mode: ProjectMode
  project?: WorkspaceSummary
}

export function ProjectDialog({ userId, mode, project }: ProjectDialogProps) {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? ""
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: ProjectType) => {
      if (mode === ProjectMode.CREATE) {
        await createProjectAction(data)
      } else if (mode === ProjectMode.UPDATE && project) {
        await updateProjectAction(project.id, data)
      }
    },
    onSuccess: async () => {
      form.reset()
      toast.success(
        mode === ProjectMode.CREATE
          ? t("Projects.createdSuccessfully")
          : t("Projects.updatedSuccessfully")
      )
      await queryClient.invalidateQueries({ queryKey: ["user", userId] })
      setOpen(false)
    },
    onError: (err) => {
      if (err instanceof Error && err.message === "PROJECT_NAME_ALREADY_EXISTS") {
        toast.error(t("GlobalErrors.PROJECT_NAME_ALREADY_EXISTS"))
        return
      }

      toast.error(t("GlobalErrors.INTERNAL_SERVER_ERROR"))
    }
  })

  const onSubmit = (data: ProjectType) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="self-end">
        <Button
          size="sm"
          effect={mode === ProjectMode.CREATE ? "ringHover" : undefined}
          variant={mode === ProjectMode.CREATE ? undefined : "ghost"}
          className={mode === ProjectMode.UPDATE ? "w-full justify-start flex gap-3" : ""}
        >
          {mode === ProjectMode.CREATE ? (
            t("Projects.createProject")
          ) : (
            <>
              <Pencil />
              {t("Projects.update")}
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === ProjectMode.CREATE
              ? t("Projects.createNewProject")
              : t("Projects.updateProject")}
          </DialogTitle>
          <DialogDescription>
            {mode === ProjectMode.CREATE
              ? t("Projects.createProjectDescription")
              : t("Projects.editProjectDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Projects.name")}</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={t("Projects.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Projects.description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("Projects.descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("Projects.cancel")}</Button>
              </DialogClose>

              <Button type="submit" size="sm" effect="ringHover" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Spinner />
                    {mode === ProjectMode.CREATE ? t("Projects.creating") : t("Projects.updating")}
                  </>
                ) : mode === ProjectMode.CREATE ? (
                  t("Projects.create")
                ) : (
                  t("Projects.update")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
