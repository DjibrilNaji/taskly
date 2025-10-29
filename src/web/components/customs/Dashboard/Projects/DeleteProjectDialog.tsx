import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { deleteProjectAction } from "@/actions/delete-project"
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
import { Spinner } from "@/web/components/ui/spinner"

interface DeleteProjectDialogProps {
  userId: string
  projectId: number
}

export function DeleteProjectDialog({ userId, projectId }: DeleteProjectDialogProps) {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => await deleteProjectAction(projectId),
    onSuccess: async () => {
      toast.success(t("Projects.deletedSuccessfully"))
      await queryClient.invalidateQueries({ queryKey: ["user", userId] })
      setOpen(false)
    },
    onError: () => {
      toast.error(t("GlobalErrors.INTERNAL_SERVER_ERROR"))
    }
  })

  const onSubmit = () => {
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="self-end">
        <Button size="sm" variant="ghost" className="w-full justify-start flex gap-3">
          <Trash2 />
          {t("Projects.delete")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Projects.deleteProject")}</DialogTitle>
          <DialogDescription>{t("Projects.deleteProjectDescription")}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("Projects.cancel")}</Button>
          </DialogClose>

          <Button
            type="submit"
            size="sm"
            effect="ringHover"
            variant="destructive"
            disabled={mutation.isPending}
            onClick={onSubmit}
          >
            {mutation.isPending ? (
              <>
                <Spinner />
                {t("Projects.deleting")}
              </>
            ) : (
              t("Projects.delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
