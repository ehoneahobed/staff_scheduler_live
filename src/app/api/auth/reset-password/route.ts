import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email"; // You'll need to implement this

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken, passwordResetExpires },
  });

  // Send email with reset link
  await sendResetPasswordEmail(user.email, resetToken);

  return NextResponse.json({ message: "Reset email sent" }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const { token, newPassword } = await req.json();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
}
