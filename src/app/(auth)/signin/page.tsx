import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In - Staff Portal",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/shifts');
  }

  return <SignInForm />;
} 