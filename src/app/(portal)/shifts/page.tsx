import { Metadata } from "next";
import ShiftsPageClient from "@/components/shifts/ShiftsPageClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shift Management",
  description: "Manage employee shifts",
};

export default async function ShiftsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return <ShiftsPageClient />;
} 