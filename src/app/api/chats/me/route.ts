import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Fetch all chats for the user
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info(`Fetched ${chats.length} chats for user: ${userId}`);

    return NextResponse.json({
      success: true,
      chats,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
