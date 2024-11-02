import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/shifts/[id] - Fetch a single shift
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shift = await prisma.shift.findUnique({
      where: { id: params.id },
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
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    return NextResponse.json(shift);
  } catch (error) {
    console.error("Error fetching shift:", error);
    return NextResponse.json(
      { error: "Failed to fetch shift" },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/[id] - Update a shift
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const manager = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (manager?.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can update shifts" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { startTime, endTime, type, userId, notes, status } = body;

    const shift = await prisma.shift.update({
      where: { id: params.id },
      data: {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        type,
        userId,
        notes,
        status,
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
    console.error("Error updating shift:", error);
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 }
    );
  }
}

// DELETE /api/shifts/[id] - Delete a shift
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const manager = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (manager?.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can delete shifts" },
        { status: 403 }
      );
    }

    await prisma.shift.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Shift deleted successfully" });
  } catch (error) {
    console.error("Error deleting shift:", error);
    return NextResponse.json(
      { error: "Failed to delete shift" },
      { status: 500 }
    );
  }
} 