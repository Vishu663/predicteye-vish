import logger from "@/lib/config/logger";
import { ApplicationEnvironment } from "@/lib/constants";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";

const ServerSideErrorHandler = (error: unknown): NextResponse => {
  // Log the error for debugging purposes
  if (env.NODE_ENV === ApplicationEnvironment.DEVELOPMENT) {
    console.log("Server-side error:", error);
  } else {
    logger.error(error);
  }

  if (error instanceof Error && error.message.includes("prisma")) {
    // Handle Prisma-related errors
    const prismaError = error as any; // Cast to any to access meta fields if available
    return NextResponse.json(
      {
        success: false,
        message: "Database Error",
        trace:
          env.NODE_ENV === ApplicationEnvironment.DEVELOPMENT
            ? prismaError.stack
            : null,
      },
      { status: 400 }, // Bad Request for Prisma errors
    );
  }

  if (error instanceof Error) {
    // Handle other types of Error objects
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    );
  } else if (typeof error === "string") {
    // Handle simple string errors
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 },
    );
  } else {
    // Fallback for any other types of errors
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
};

export default ServerSideErrorHandler;
