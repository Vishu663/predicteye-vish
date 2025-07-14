import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { category } = body; // ✅ Extract category from request body

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
        { status: 404 }
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
                content: `You are an AI assistant that helps predict resale values for ${category || chat.service.name}. Ask the user a set of specific and relevant questions about their item to help generate an accurate resale prediction.`, // ✅ Dynamic prompt
                timestamp: new Date(),
              },
              {
                role: "assistant",
                content: `Let's begin the prediction process for this ${category || "item"}. Please answer a few questions to help us estimate its resale value.`,
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
