import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chatId: string; blockId: string }> },
) {
  try {
    const { blockId } = await params;
    const { status } = await request.json();

    // Validate status
    if (!["completed", "in_progress"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 },
      );
    }

    // Find and update block
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

    // Update block status
    await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        status,
      },
    });

    logger.info(`Block status updated: ${blockId}, status: ${status}`);

    return NextResponse.json({
      success: true,
      block,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
