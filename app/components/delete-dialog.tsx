"use client"

import { Loader, Trash } from "lucide-react"
import { Toast } from "radix-ui"
import { useState } from "react"
// import { IconLoader2, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { createClient } from "~/lib/supabase/client"

interface DeleteDialogProps {
  id: string
  table: string
  itemName: string
  onSuccess?: () => void
}

export function DeleteDialog({ id, table, itemName, onSuccess }: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from(table).delete().eq("id", id)

    if (error) {
      toast.error(`Failed to delete ${itemName}`, {
        description: error.message,
      })
      setLoading(false)
      return
    }

    toast.success(`${itemName} deleted successfully`)
    setOpen(false)
    setLoading(false)
    
    if (onSuccess) {
      onSuccess()
    } else {
      toast.error("No onSuccess callback provided for DeleteDialog")
      // router.refresh()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete {itemName}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{itemName}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
