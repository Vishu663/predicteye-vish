import prisma from "@/lib/config/prisma";
import { authOptions } from "@/lib/helpers/auth-options";
import ServerSideErrorHandler from "@/lib/helpers/errors/server";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the where clause
    const where = {
      isPinned: true,
      // Add search functionality if search term is provided
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              {
                messages: {
                  some: { content: { contains: search, mode: "insensitive" } },
                },
              },
            ],
          }
        : {}),
    };

    // Get total count for pagination
    const totalCount = await prisma.block.count({
      // @ts-expect-error - TS doesn't know about 'mode' yet
      where,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch pinned blocks with pagination
    const blocks = await prisma.block.findMany({
      // @ts-expect-error - TS doesn't know about 'mode' yet
      where,
      include: {
        messages: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      blocks,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    return ServerSideErrorHandler(error);
  }
}
