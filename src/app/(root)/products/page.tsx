"use client";

import PredictionDisplay from "@/components/common/prediction-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import ClientSideErrorHandler from "@/lib/helpers/errors/client";
import type { Block } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, Clock, MessageSquare, PinOff, Search } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const PinnedBlockListingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get current page from search params or default to 1
  const currentPage = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 9);
  const search = searchParams.get("search") || "";

  // Create a function to update the URL with new search params
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Navigate to a specific page
  const goToPage = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page })}`);
  };

  // Set search term
  const handleSearch = () => {
    setIsSearching(true);
    router.push(
      `${pathname}?${createQueryString({ search: searchTerm, page: 1 })}`,
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    router.push(`${pathname}?${createQueryString({ search: null, page: 1 })}`);
  };

  // Fetch pinned blocks
  const fetchPinnedBlocks = useCallback(async () => {
    try {
      setLoading(true);
      const query = qs.stringify({
        page: currentPage,
        limit,
        search: search || undefined,
      });

      const response = await fetch(`/api/blocks?${query}`);

      if (!response.ok) {
        throw new Error("Failed to fetch pinned blocks");
      }

      const data = await response.json();

      if (data.success) {
        setBlocks(data.blocks);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [currentPage, limit, search]);

  // Unpin a block
  const unpinBlock = async (blockId: string) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to unpin block");
      }

      // Close modal if the unpinned block is currently selected
      if (selectedBlock?.id === blockId) {
        setIsModalOpen(false);
        setSelectedBlock(null);
      }

      // Remove the unpinned block from the list
      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block.id !== blockId),
      );
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };

  // Open modal with selected block
  const openBlockDetails = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  // Load blocks when page, limit, or search changes
  useEffect(() => {
    fetchPinnedBlocks();
  }, [fetchPinnedBlocks]);

  // Initialize search term from URL
  useEffect(() => {
    if (search) {
      setSearchTerm(search);
    }
  }, [search]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href={`${pathname}?${createQueryString({ page: 1 })}`}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= totalPages) continue;

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${pathname}?${createQueryString({ page: i })}`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`${pathname}?${createQueryString({ page: totalPages })}`}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Blocks</h1>
          <p className="text-muted-foreground">
            View and manage your saved blocks
          </p>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button type="submit" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          {search && (
            <Button variant="outline" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No saved blocks found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {search
              ? `No results found for "${search}"`
              : "You haven't saved any blocks yet."}
          </p>
          {search && (
            <Button variant="outline" className="mt-4" onClick={clearSearch}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blocks.map((block) => (
            <Card key={block.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="mr-1 truncate">
                    {block.prediction?.chat_name ||
                      `Block ${block.id.slice(0, 8)}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => unpinBlock(block.id)}
                    title="Unpin block"
                  >
                    <PinOff className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <section className="flex items-center justify-between gap-6">
                  {/* Prediction Image */}
                  {block.prediction?.image && (
                    <image className="overflow-hidden rounded-md">
                      <Image
                        src={block.prediction.image}
                        alt="Prediction"
                        className="h-full w-full object-cover"
                        height={100}
                        width={100}
                      />
                    </image>
                  )}
                  {/* Prediction Estimated Price */}
                  {block.prediction?.estimated_price && (
                    <div className="text-right text-sm font-medium text-muted-foreground">
                      <p>Estimated Price</p>
                      <p className="text-lg font-bold text-primary">
                        {block.prediction.estimated_price.toLocaleString()}
                      </p>
                    </div>
                  )}
                </section>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(block.createdAt), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {format(new Date(block.createdAt), "h:mm a")}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openBlockDetails(block)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`${pathname}?${createQueryString({ page: Math.max(1, currentPage - 1) })}`}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={`${pathname}?${createQueryString({ page: Math.min(totalPages, currentPage + 1) })}`}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Block Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto scrollbar-hide">
          {selectedBlock && (
            <>
              <DialogHeader>
                <DialogTitle className="pointer-events-auto relative z-50 mt-6 flex items-center justify-between">
                  <span>
                    {selectedBlock.title ||
                      `Block ${selectedBlock.id.slice(0, 8)}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => unpinBlock(selectedBlock.id)}
                  >
                    <PinOff className="h-4 w-4" />
                    <span>Unpin</span>
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  Created on{" "}
                  {format(
                    new Date(selectedBlock.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Prediction Display */}
                {selectedBlock.prediction && (
                  <PredictionDisplay prediction={selectedBlock.prediction} />
                )}

                {/* Block Messages */}
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-medium">Messages</h3>
                  <div className="space-y-3">
                    {selectedBlock.messages &&
                      selectedBlock.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-black/80 text-primary-foreground"
                                : "bg-secondary-foreground dark:bg-muted"
                            }`}
                          >
                            <div className="prose prose-invert max-w-none">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PinnedBlockListingPage;
