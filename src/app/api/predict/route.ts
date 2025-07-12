import prisma from "@/lib/config/prisma"; // Ensure Prisma is imported
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { images, chatId, blockId } = await request.json();

    // Validate user authorization for the chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        service: true,
        blocks: {
          where: {
            id: blockId,
          },
          include: {
            messages: {
              include: {
                fileData: true,
              },
            },
          },
        },
      },
    });

    if (!chat || chat.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    // Initialize variables for jewelry-specific data
    let materialType = "Gold"; // Default to Gold
    let weight = 0; // Default weight

    // Check if the service name contains "jewelry" (case-insensitive)
    if (chat.service?.name?.toLowerCase().includes("jewelry")) {
      // Extract material type and weight from user inputs in the specific block
      const targetBlock = chat.blocks.find((block) => block.id === blockId);

      if (targetBlock) {
        // Extract material type
        const materialMessage = targetBlock.messages.find(
          (message) =>
            message.role === "user" &&
            [
              "Gold",
              "Silver",
              "Platinum",
              "White Gold",
              "Rose Gold",
              "Stainless Steel",
              "Other",
            ].some((type) =>
              message.content.toLowerCase().includes(type.toLowerCase()),
            ),
        );
        materialType = materialMessage?.content || "Gold";

        // Extract weight
        const weightMessageIndex = targetBlock.messages.findIndex(
          (message) =>
            message.role === "assistant" &&
            message.content.toLowerCase().includes("gram"),
        );

        if (
          weightMessageIndex !== -1 &&
          targetBlock.messages[weightMessageIndex + 1]
        ) {
          const nextMessage = targetBlock.messages[weightMessageIndex + 1];
          const weightInput = nextMessage.content.match(/\d+/)?.[0] || "0";
          weight = parseFloat(weightInput) || 0;
        }

        console.log("Material Type:", materialType);
        console.log("Weight:", weight);
      }
    }

    // Prepare prompt with context and images
    let prompt =
      "Please predict the resale value for this item based on the following details in conversation format:\n\n";

    let image = null;

    // Add context (messages) to the prompt
    chat.blocks[0].messages.forEach((message) => {
      prompt += `${message.role}: ${message.content}\n`;
      if (message.fileData && message.fileData.url) {
        prompt += `File: ${message.fileData.url}\n`;
        image = message.fileData.url;
      }
    });

    // Add jewelry-specific details to the prompt if applicable
    if (chat.service?.name?.toLowerCase().includes("jewelry")) {
      prompt += `
      Material Type: ${materialType}
      Weight: ${weight} grams

      Important Notes:
      1. Jewelry is often considered an appreciating asset, with its resale value influenced by factors such as material type, weight, and market trends.
      2. Determine the current market price of ${materialType} per gram for the given year.
      3. Analyze historical data to estimate the annual percentage increase in the price of ${materialType}.
      4. Calculate the estimated resale value based on the provided weight, current market price, and projected annual price increase.

      Please use reliable market data and your expertise to provide an accurate resale value prediction. Include a clear explanation of your calculations and assumptions, considering factors like material demand, economic conditions, and historical trends.
      `;
    }

    // Add image URLs if available
    if (images && images.length > 0) {
      prompt += "\nImages:\n";
      images.forEach((image: string) => {
        prompt += `${image}\n`;
      });
    }

    // Generate prediction using Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: `You are an AI assistant that specializes in predicting resale values for furniture and jewelry. Analyze the provided details and images to give an accurate resale value prediction and ignore vague conversations in the prompt mentioning errors in past cycles. Provide a price range and explain your reasoning based on factors like brand, condition, age, and market trends. Format your response in a clear, professional manner wherein the predicted price is mentioned on the top (properly highlighted). Ensure that the JSON object at the end of your response adheres to the following structure and formatting:
          
          {
          "chat_name": "Resale Value Prediction", // Provide a relevant chat name based on the product details
          "estimated_price": "$10000", // Always include a dollar sign and ensure consistency in formatting
          "price_variation": ["$8000", "$12000"], // Provide a range with two values, both formatted with a dollar sign
          "resale_in_year": { "2024": "$9500", "2025": "$9000", "2026": "$8500" }, // Include year as key and price as value, formatted with a dollar sign, while year goes upto minimum 2026 if not provided in the context in form of (planned_resale_year + 1)
          "user_inputs": { ... } // Reflect the user-provided inputs in a structured format
          }
          
          Make sure the JSON is valid and properly formatted. Avoid any ambiguity or missing fields.`,
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

    // Extract the prediction text from the response
    const predictionText = response.data.candidates[0].content.parts[0].text;

    // Extract JSON from the prediction
    const jsonStartIndex = predictionText.indexOf("{");
    const jsonEndIndex = predictionText.lastIndexOf("}");
    let predictionJson = null;

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      const jsonString = predictionText.slice(jsonStartIndex, jsonEndIndex + 1);
      try {
        predictionJson = JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing JSON from prediction:", error);
        predictionJson = { error: "Invalid JSON format in prediction" }; // Fallback JSON structure
      }
    } else {
      console.error("No valid JSON found in prediction text");
      predictionJson = { error: "No JSON found in prediction" }; // Fallback JSON structure
    }

    // Ensure the response structure is consistent
    const structuredResponse = {
      success: true,
      prediction: {
        text: predictionText.split("```json")?.[0] || "", // Text without JSON
        json: { ...predictionJson, chatId, blockId, image: image || images[0] }, // Include chat and block IDs
      },
    };

    // Update the block's prediction field in the database
    await prisma.block.update({
      where: { id: blockId },
      data: {
        prediction: structuredResponse.prediction.json,
      },
    });

    if (
      chat.title === "New Chat" &&
      structuredResponse.prediction.json?.chat_name
    ) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          title: structuredResponse.prediction.json.chat_name,
        },
      });
    }

    return NextResponse.json(structuredResponse);
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
