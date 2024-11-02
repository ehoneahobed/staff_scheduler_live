import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user to check if they're a manager
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (currentUser?.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can view staff list" },
        { status: 403 }
      );
    }

    // Fetch all staff members
    const users = await prisma.user.findMany({
      where: {
        role: "STAFF",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 