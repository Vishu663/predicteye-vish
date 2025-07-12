import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string; blockId: string } },
) {
  try {
    const { blockId } = params;
    const { message } = await request.json();

    // Find block
    const block = await prisma.block.findUnique({
      where: {
        id: blockId,
      },
    });

    if (!block) {
      return NextResponse.json(
        { success: false, error: "Block not found" },
        { status: 404 },
      );
    }

    // Add message to messages
    const updatedBlock = await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        messages: {
          create: {
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
            ...(message.fileData && {
              fileData: {
                create: {
                  url: message.fileData.url,
                  name: message.fileData.name,
                  type: message.fileData.type,
                },
              },
            }),
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

    logger.info(`Message added to block: ${blockId}`);

    return NextResponse.json({
      success: true,
      block: updatedBlock,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
