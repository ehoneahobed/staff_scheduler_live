import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { name, email } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}
