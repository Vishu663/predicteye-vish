"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

type DialogsProps = {
  showNewBlockDialog: boolean;
  setShowNewBlockDialog: (show: boolean) => void;
  showDiscardBlockDialog: boolean;
  setShowDiscardBlockDialog: (show: boolean) => void;
  onCreateNewBlock: () => void;
  onDiscardBlock: () => void;
  savingBlock: boolean;
};

export default function Dialogs({
  showNewBlockDialog,
  setShowNewBlockDialog,
  showDiscardBlockDialog,
  setShowDiscardBlockDialog,
  onCreateNewBlock,
  onDiscardBlock,
  savingBlock,
}: DialogsProps) {
  return (
    <>
      {/* New Block Dialog */}
      <AlertDialog
        open={showNewBlockDialog}
        onOpenChange={setShowNewBlockDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Block?</AlertDialogTitle>
            <AlertDialogDescription>
              Your prediction is complete. Would you like to start a new block
              to ask more questions?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Here</AlertDialogCancel>
            <AlertDialogAction
              onClick={onCreateNewBlock}
              disabled={savingBlock}
            >
              {savingBlock ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create New Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Block Dialog */}
      <AlertDialog
        open={showDiscardBlockDialog}
        onOpenChange={setShowDiscardBlockDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard This Block?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the current block as discarded. You will still be
              able to view it, but cannot make further changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDiscardBlock}
              disabled={savingBlock}
              className="bg-red-500 hover:bg-red-600"
            >
              {savingBlock ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Discard Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
