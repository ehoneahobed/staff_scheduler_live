"use client";

import ShiftCalendar from "./ShiftCalendar";

export default function ShiftsPageClient() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shift Management</h1>
      </div>
      <ShiftCalendar />
    </div>
  );
} 