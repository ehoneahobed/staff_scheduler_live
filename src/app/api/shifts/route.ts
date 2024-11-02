import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { startOfDay, endOfDay, parseISO } from "date-fns";

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

    // Convert dates to UTC while preserving the local date
    const start = startDate ? startOfDay(parseISO(startDate)) : null;
    const end = endDate ? endOfDay(parseISO(endDate || startDate)) : null;

    console.log("Fetching shifts with params:", {
      startDate,
      endDate,
      userId,
      startOfDay: start,
      endOfDay: end,
    });

    const shifts = await prisma.shift.findMany({
      where: {
        ...(start && end
          ? {
              startTime: {
                gte: start,
                lte: end,
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

    console.log("Found shifts:", shifts);

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
    console.log("Creating shift with data:", body);

    const { startTime, endTime, type, userId, notes } = body;

    // Convert the local datetime strings to Date objects
    const shiftStartTime = parseISO(startTime);
    const shiftEndTime = parseISO(endTime);

    // Get the current user to check if they're a manager
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (currentUser?.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can create shifts" },
        { status: 403 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        type,
        notes,
        userId,
        createdById: currentUser.id,
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

    console.log("Created shift:", shift);

    return NextResponse.json(shift);
  } catch (error) {
    console.error("Error creating shift:", error);
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
} 