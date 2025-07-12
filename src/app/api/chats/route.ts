import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { serviceId, title } = await request.json();

    // Get user session
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 },
      );
    }

    // Validate service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      logger.error(`Service not found: ${serviceId}`);
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }

    // Create new chat with initial block
    const chat = await prisma.chat.create({
      data: {
        userId,
        serviceId,
        title: title || "New Chat",
        blocks: {
          create: {
            title: "Block 1",
            messages: {
              create: [
                {
                  role: "system",
                  content: `You are an AI assistant that helps predict resale values for ${service.name}. Ask the user questions about their item to provide an accurate prediction.`,
                  timestamp: new Date(),
                },
                {
                  role: "assistant",
                  content: `Welcome to the ${service.name} service! I'll help you predict the resale value of your item. Please provide details about your item or upload images to get started.`,
                  timestamp: new Date(),
                },
              ],
            },
          },
        },
      },
      include: {
        blocks: {
          include: {
            messages: true,
          },
        },
      },
    });

    logger.info(
      `New chat created: ${chat.id} for service: ${serviceId} by user: ${userId}`,
    );

    return NextResponse.json({
      success: true,
      chat,
      block: chat.blocks[0],
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
