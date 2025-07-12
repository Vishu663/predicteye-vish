import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;
    const { message, blockId } = await request.json();

    // Validate chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        blocks: {
          select: {
            id: true,
          },
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

    // Get block
    if (!chat.blocks.some((block) => block.id === blockId)) {
      logger.error(`Block not found in chat: ${blockId}`);
      return NextResponse.json(
        { success: false, error: "Block not found in chat" },
        { status: 404 },
      );
    }

    const block = await prisma.block.findUnique({
      where: {
        id: blockId,
      },
      include: {
        messages: true,
      },
    });

    if (!block) {
      logger.error(`Block not found: ${blockId}`);
      return NextResponse.json(
        { success: false, error: "Block not found" },
        { status: 404 },
      );
    }

    // Get previous messages for context
    // const messages = block.messages.map(
    //   (iter: { role: string; content: string }) => ({
    //     role: iter.role,
    //     content: iter.content,
    //   })
    // );

    // Generate AI response using Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }],
            role: "user",
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: "You are an AI assistant that helps predict resale values for furniture and jewelry. Ask follow-up questions to gather more information about the item. When you have enough information, provide an estimated resale value range and explain your reasoning.",
            },
          ],
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Extract the AI response
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Add AI response
    await prisma.message.createMany({
      data: [
        {
          blockId: blockId,
          role: "user",
          content: message,
          timestamp: new Date(),
        },
        {
          blockId: blockId,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        },
      ],
    });

    logger.info(`Message sent in chat: ${chatId}, block: ${blockId}`);

    return NextResponse.json({
      success: true,
      message: aiResponse,
      block,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
