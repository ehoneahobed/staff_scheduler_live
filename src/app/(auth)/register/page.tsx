import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register - Staff Portal",
  description: "Create your account",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/shifts');
  }

  return <RegisterForm />;
} 