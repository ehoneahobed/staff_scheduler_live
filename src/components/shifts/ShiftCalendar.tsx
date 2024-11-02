"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Shift, User } from "@prisma/client";
import CreateShiftDialog from "@/components/shifts/CreateShiftDialog";
import ShiftList from "@/components/shifts/ShiftList";
import { format } from "date-fns";

type ShiftWithUser = Shift & {
  user: Pick<User, "id" | "name" | "email"> | null;
};

export default function ShiftCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: shifts, isLoading } = useQuery<ShiftWithUser[]>({
    queryKey: ["shifts", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const startDate = format(selectedDate, "yyyy-MM-dd");
      console.log("Fetching shifts for date:", startDate);
      
      const response = await fetch(
        `/api/shifts?startDate=${startDate}&endDate=${startDate}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Shift fetch error:", errorData);
        throw new Error("Failed to fetch shifts");
      }
      
      const data = await response.json();
      console.log("Fetched shifts:", data);
      
      return data.map((shift: ShiftWithUser) => ({
        ...shift,
        startTime: new Date(shift.startTime),
        endTime: new Date(shift.endTime),
        createdAt: new Date(shift.createdAt),
        updatedAt: new Date(shift.updatedAt),
      }));
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date: Date | undefined) => {
            if (date) {
              console.log("Selected date:", format(date, "yyyy-MM-dd"));
              setSelectedDate(date);
            }
          }}
          className="rounded-md"
        />
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Shifts for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <CreateShiftDialog selectedDate={format(selectedDate, "yyyy-MM-dd")} />
        </div>
        <ShiftList shifts={shifts || []} isLoading={isLoading} />
      </Card>
    </div>
  );
} 