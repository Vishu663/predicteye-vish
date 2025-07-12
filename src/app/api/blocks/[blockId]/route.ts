import prisma from "@/lib/config/prisma";
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { blockId } = await params;
    const { isPinned } = await request.json();

    // Validate input
    if (typeof isPinned !== "boolean") {
      return NextResponse.json(
        { message: "Invalid isPinned value" },
        { status: 400 },
      );
    }

    // Find the block and verify ownership through the chat
    const block = await prisma.block.findUnique({
      where: {
        id: blockId,
      },
      include: {
        chat: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!block) {
      return NextResponse.json({ message: "Block not found" }, { status: 404 });
    }

    // Verify the user owns the chat that contains this block
    if (block.chat.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update the block's isPinned status
    const updatedBlock = await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        isPinned,
      },
    });

    return NextResponse.json({
      message: "Block updated successfully",
      block: updatedBlock,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
