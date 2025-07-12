"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientSideErrorHandler from "@/lib/helpers/errors/client";
import type { Block, Message, Service, UploadedFile } from "@/lib/types";

import PredictionDisplay from "@/components/common/prediction-display";
import { ArrowDown, Pin, PinOff, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type MessageListProps = {
  messages: Message[];
  service: Service | null;
  blocks?: Block[];
  currentBlock: Block | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  services: Service[];
  onSelectService: (serviceId: string) => void;
  files: UploadedFile[];
};

export default function MessageList({
  messages,
  service,
  blocks = [],
  currentBlock,
  messagesEndRef,
  services,
  onSelectService,
  files,
}: MessageListProps) {
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentBlockRef = useRef<HTMLDivElement>(null);
  const [localBlocks, setLocalBlocks] = useState<Block[]>(blocks);
  const [prevCurrentBlockId, setPrevCurrentBlockId] = useState<string | null>(
    null,
  );

  // Update local blocks when blocks prop changes
  useEffect(() => {
    setLocalBlocks(blocks);
  }, [blocks]);

  // Update local blocks when messages change
  useEffect(() => {
    if (currentBlock && messages.length > 0) {
      // Update the current block in the local blocks state
      setLocalBlocks((prevBlocks) => {
        // Check if the current block exists in prevBlocks
        const blockExists = prevBlocks.some(
          (block) => block.id === currentBlock.id,
        );

        if (blockExists) {
          // Update existing block
          return prevBlocks.map((block) =>
            block.id === currentBlock.id ? { ...block, messages } : block,
          );
        } else {
          // Add the new block if it doesn't exist
          return [...prevBlocks, { ...currentBlock, messages }];
        }
      });
    }
  }, [messages, currentBlock]);

  // Scroll to current block when it changes
  useEffect(() => {
    // Only scroll if the current block ID has changed
    if (currentBlock?.id !== prevCurrentBlockId) {
      if (currentBlockRef.current) {
        // Use a small timeout to ensure the DOM has updated
        setTimeout(() => {
          currentBlockRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      setPrevCurrentBlockId(currentBlock?.id || null);
    }
  }, [currentBlock, prevCurrentBlockId]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  const scrollToCurrentBlock = () => {
    if (currentBlockRef.current) {
      currentBlockRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const pinBlock = async (blockId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned }),
      });

      if (!response.ok) {
        throw new Error("Failed to update block");
      }

      // Update local blocks state to reflect the pin status change
      setLocalBlocks((prevBlocks) =>
        prevBlocks.map((block) =>
          block.id === blockId ? { ...block, isPinned } : block,
        ),
      );
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };

  if (!service) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <Sparkles size={48} className="mb-4 text-primary" />
        <h2 className="mb-2 text-2xl font-bold">Welcome to Service Chat</h2>
        <p className="max-w-md text-muted-foreground">
          Select a service from the sidebar to start a new chat or continue an
          existing one.
        </p>

        <div className="mx-auto mt-6 flex max-w-md gap-x-2 overflow-x-scroll scrollbar-hide max-sm:flex-col">
          {services.map((s) => (
            <Button
              key={s.id}
              variant={"ghost"}
              className="flex h-40 flex-col items-center justify-center text-sm"
              onClick={() => onSelectService(s.id)}
            >
              {s.icon ? (
                <span className="mr-2 text-7xl">{s.icon}</span>
              ) : (
                <Sparkles size={16} className="mr-2" />
              )}
              {s.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // If we have blocks, display all of them
  if (localBlocks.length > 0) {
    return (
      <div className="relative mx-auto max-w-2xl flex-1 xl:max-w-4xl">
        <ScrollArea className="p-4 max-md:h-[75svh] md:h-[70svh]">
          <div className="space-y-8">
            {localBlocks
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((block, blockIndex) => (
                <section
                  key={block.id}
                  className={`relative rounded-lg border p-4 ${
                    block.id === currentBlock?.id
                      ? "border-primary"
                      : "border-muted"
                  }`}
                  ref={
                    block.id === currentBlock?.id ? currentBlockRef : undefined
                  }
                  id={`block-${block.id}`}
                >
                  <header className="sticky left-0 top-2 z-10 mb-4 flex w-full flex-col items-center gap-4 rounded-md bg-secondary-foreground p-2 text-white shadow-lg dark:bg-secondary">
                    <section className="flex w-full items-center justify-between gap-2">
                      <h3 className="text-sm font-medium">{block.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          {block.status === "completed" && "Completed"}
                        </span>
                        <span>
                          {block.status === "in_progress" && "Active"}
                        </span>
                        {block.isPinned ? (
                          <Button
                            variant={"ghost"}
                            title="Unpin"
                            className="text-xs"
                            onClick={() => pinBlock(block.id, false)}
                          >
                            <PinOff className="h-4 w-4" /> Remove From Saved
                          </Button>
                        ) : (
                          <Button
                            variant={"ghost"}
                            title="Pin"
                            className="text-xs"
                            onClick={() => pinBlock(block.id, true)}
                          >
                            <Pin className="h-4 w-4" /> Save
                          </Button>
                        )}
                      </div>
                    </section>
                  </header>

                  <main className="mt-16 space-y-4">
                    {/* Selected Image Section */}
                    {block.status === "completed" &&
                      block.prediction?.image && (
                        <div className="mb-4">
                          <Image
                            src={block.prediction.image || "/placeholder.svg"}
                            alt={block.prediction.chat_name || "Selected Image"}
                            className="h-auto max-h-[400px] w-full rounded-md object-contain"
                            height={200}
                            width={350}
                            unoptimized
                          />
                        </div>
                      )}
                    {block.status === "in_progress" &&
                      files.length > 0 &&
                      currentBlock?.id === block.id && (
                        <div className="mb-4">
                          <Image
                            src={files?.[0]?.url || "/placeholder.svg"}
                            alt={files?.[0]?.name || "Selected Image"}
                            className="h-auto max-h-[400px] w-full rounded-md object-contain"
                            height={200}
                            width={350}
                            unoptimized
                          />
                        </div>
                      )}
                    {(block.messages || [])
                      .filter((m) => m.role !== "system")
                      .map((message, index) => (
                        <div
                          key={`message-${blockIndex}-${index}`}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary-foreground dark:bg-muted/50"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>
                            )}

                            {/* Display file if present */}
                            {message.fileData &&
                              message.fileData.type.startsWith("image/") && (
                                <div className="mt-2 overflow-hidden rounded-md">
                                  <Image
                                    src={
                                      message.fileData.url || "/placeholder.svg"
                                    }
                                    alt={message.fileData.name}
                                    className="h-auto max-h-[200px] max-w-full object-contain"
                                    height={200}
                                    width={350}
                                    unoptimized
                                  />
                                </div>
                              )}

                            {/* Display non-image file */}
                            {message.fileData &&
                              !message.fileData.type.startsWith("image/") && (
                                <div className="mt-2 flex items-center rounded bg-background/50 p-2">
                                  <Upload className="mr-2 h-4 w-4" />
                                  <span className="truncate text-sm">
                                    {message.fileData.name}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                  </main>
                  {/* Display prediction if present */}
                  {block.prediction && (
                    <footer className="relative">
                      <PredictionDisplay prediction={block.prediction} />
                    </footer>
                  )}
                </section>
              ))}
          </div>
          <div ref={messagesEndRef} className="pb-20" />{" "}
          {/* Added padding at the bottom for better scrolling */}
        </ScrollArea>

        {/* Scroll to current block button */}
        {localBlocks.length > 1 && currentBlock && (
          <Button
            onClick={scrollToCurrentBlock}
            className="absolute bottom-4 right-4 rounded-full shadow-md md:bottom-16"
            size="icon"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Fallback for when there are no blocks but we have messages
  if (messages.length > 0) {
    return (
      <div className="relative flex-1">
        <ScrollArea className="h-[75svh] p-4">
          <div className="space-y-4">
            {messages
              .filter((m) => m.role !== "system")
              .map((message, index) => (
                <div
                  key={`message-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    )}

                    {/* Display file if present */}
                    {message.fileData &&
                      message.fileData.type.startsWith("image/") && (
                        <div className="mt-2 overflow-hidden rounded-md">
                          <Image
                            src={message.fileData.url || "/placeholder.svg"}
                            alt={message.fileData.name}
                            className="h-auto max-h-[200px] max-w-full object-contain"
                            height={200}
                            width={350}
                            unoptimized
                          />
                        </div>
                      )}

                    {/* Display non-image file */}
                    {message.fileData &&
                      !message.fileData.type.startsWith("image/") && (
                        <div className="mt-2 flex items-center rounded bg-background/50 p-2">
                          <Upload className="mr-2 h-4 w-4" />
                          <span className="truncate text-sm">
                            {message.fileData.name}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
          <div ref={messagesEndRef} className="pb-20" />
        </ScrollArea>
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Sparkles size={48} className="mb-4 text-primary" />
      <h2 className="mb-2 text-2xl font-bold">Start a New Conversation</h2>
      <p className="max-w-md text-muted-foreground">
        Begin by sending a message or question related to {service.name}.
      </p>
    </div>
  );
}
