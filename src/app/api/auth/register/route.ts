import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return NextResponse.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
  }
}
