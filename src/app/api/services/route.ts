import logger from "@/lib/config/logger";
import prisma from "@/lib/config/prisma";
import { SERVICES } from "@/lib/constants";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch all services
    let services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no services exist, insert the default services
    if (services.length === 0) {
      services = await prisma.$transaction(
        SERVICES.map((service) =>
          prisma.service.create({
            data: {
              name: service.name,
              description: service.description,
              icon: service.icon,
              questionnaire: service.questionnaire,
            },
          }),
        ),
      );
      logger.info(`Inserted ${services.length} default services`);
    } else {
      logger.info(`Fetched ${services.length} services`);
    }

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
