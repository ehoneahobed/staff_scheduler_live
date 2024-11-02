import { Metadata } from "next";
import StaffListingClient from "@/components/staff/StaffListingClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Staff Management",
  description: "Manage staff members",
};

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Check if user is a manager
  if (session.user.role !== "MANAGER") {
    redirect('/shifts');
  }

  return <StaffListingClient />;
} 