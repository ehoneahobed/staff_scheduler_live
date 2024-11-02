import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/shifts - Fetch shifts with optional filters
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");

    const shifts = await prisma.shift.findMany({
      where: {
        ...(startDate && endDate
          ? {
              startTime: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}

// POST /api/shifts - Create a new shift
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { startTime, endTime, type, userId, notes } = body;

    // Validate manager role
    const manager = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (manager?.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can create shifts" },
        { status: 403 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        notes,
        userId,
        createdById: manager.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error("Error creating shift:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
} 