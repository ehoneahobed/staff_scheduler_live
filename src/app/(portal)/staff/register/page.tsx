import { Metadata } from "next";
import StaffRegistrationForm from "@/components/staff/StaffRegistrationForm";

export const metadata: Metadata = {
  title: "Staff Registration",
  description: "Register new staff members",
};

export default function StaffRegistrationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Staff Registration</h1>
        <StaffRegistrationForm />
      </div>
    </div>
  );
} 