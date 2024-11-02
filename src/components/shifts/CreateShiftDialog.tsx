"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShiftForm } from "@/components/shifts/ShiftForm";
import { Plus } from "lucide-react";

interface CreateShiftDialogProps {
  selectedDate: string;
}

export default function CreateShiftDialog({ selectedDate }: CreateShiftDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Shift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
        </DialogHeader>
        <ShiftForm selectedDate={selectedDate} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
} 