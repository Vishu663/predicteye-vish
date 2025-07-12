import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { AuthProvider } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userCount = await prisma.user.count();

    let existingUser = null;

    if (userCount > 0) {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: `/placeholder.svg?height=50&width=50`,
        provider: AuthProvider.Local,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
