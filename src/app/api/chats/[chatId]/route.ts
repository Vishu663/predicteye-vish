import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    // Get user session
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Fetch chat with blocks
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        service: true,
        blocks: {
          include: {
            messages: {
              include: {
                fileData: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!chat) {
      logger.error(`Chat not found: ${chatId}`);
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }

    // Check if user has access to this chat if chat.userId is defined
    if (
      chat.userId &&
      chat.userId.toString() !== userId &&
      !session?.user?.id
    ) {
      logger.warn(
        `Unauthorized access attempt to chat: ${chatId} by user: ${userId}`,
      );
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    logger.info(`Chat fetched: ${chatId} by user: ${userId}`);

    return NextResponse.json({
      success: true,
      chat,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    const { title } = await request.json();

    // Validate input
    if (!title || typeof title !== "string") {
      return NextResponse.json({ message: "Invalid title" }, { status: 400 });
    }

    // Find the chat and verify ownership
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        userId: true,
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Verify the user owns this chat
    if (chat.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update the chat title
    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
