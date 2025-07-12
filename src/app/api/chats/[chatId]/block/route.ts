import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    // Validate chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        service: true,
      },
    });

    if (!chat) {
      logger.error(`Chat not found when creating block: ${chatId}`);
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }

    // Create new block
    const blockCount = await prisma.block.count({
      where: {
        chatId,
      },
    });
    const block = await prisma.block.create({
      data: {
        chatId: chat.id,
        title: `Block ${blockCount + 1}`,
        messages: {
          createMany: {
            data: [
              {
                role: "system",
                content: `You are an AI assistant that helps predict resale values for ${chat.service.name}. Ask the user questions about their item to provide an accurate prediction.`,
                timestamp: new Date(),
              },
              {
                role: "assistant",
                content: `Let's start a new prediction. Please provide details about your item or upload images to get started.`,
                timestamp: new Date(),
              },
            ],
          },
        },
      },
      include: {
        messages: {
          include: {
            fileData: true,
          },
        },
      },
    });

    logger.info(`New block created: ${block.id} for chat: ${chatId}`);

    return NextResponse.json({
      success: true,
      block,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
