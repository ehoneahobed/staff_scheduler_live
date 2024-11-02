"use client";

import { Shift, User } from "@prisma/client";
import { format } from "date-fns";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type ShiftWithUser = Shift & {
  user: Pick<User, "id" | "name" | "email"> | null;
};

interface ShiftListProps {
  shifts: ShiftWithUser[];
  isLoading: boolean;
}

export default function ShiftList({ shifts, isLoading }: ShiftListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No shifts scheduled for this day
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shifts.map((shift) => (
        <Card key={shift.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {format(new Date(shift.startTime), "HH:mm")} -{" "}
                {format(new Date(shift.endTime), "HH:mm")}
              </p>
              <p className="text-sm text-muted-foreground">
                {shift.user ? shift.user.name : "Unassigned"}
              </p>
              {shift.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  {shift.notes}
                </p>
              )}
            </div>
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {shift.type}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
} 