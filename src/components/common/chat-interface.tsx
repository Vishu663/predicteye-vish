/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ChatHeader from "@/components/pages/chat/chat-header";
import DynamicInput from "@/components/pages/chat/dynamic-input";
import MessageList from "@/components/pages/chat/message-list";
import Sidebar from "@/components/pages/chat/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import ClientSideErrorHandler from "@/lib/helpers/errors/client";
import type { Block, Chat, Message, Service, UploadedFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatInterfaceProps = {
  userId: string;
};

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  // const [formData, setFormData] = useState<Record<string, any>>({});
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatsByDate, setChatsByDate] = useState<Record<string, Chat[]>>({});
  const [isNewChat, setIsNewChat] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Load an existing chat
  const loadExistingChat = useCallback(async (chatId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      if (data.success) {
        setChatId(chatId);

        // Ensure blocks is an array before setting it
        const blocksData = Array.isArray(data.chat.blocks)
          ? data.chat.blocks
          : [];
        setBlocks(blocksData);

        // Set service
        if (data.chat?.service) {
          setService(data.chat.service);
        }

        // Make sure blocks is defined and is an array before filtering

        if (blocksData.length > 0) {
          // Sort by createdAt in descending order to get the most recent
          const sortedBlocks = [...blocksData].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          const mostRecentBlock = sortedBlocks[0];
          setCurrentBlock(mostRecentBlock);

          // Make sure messages is defined and is an array
          const blockMessages = Array.isArray(mostRecentBlock.messages)
            ? mostRecentBlock.messages
            : [];

          setMessages(blockMessages);

          setUploadedFiles(
            blockMessages
              .filter((m: { fileData: UploadedFile }) => m.fileData)
              .map((m: { fileData: UploadedFile }) => m.fileData),
          );

          // Check if the block is complete
          if (mostRecentBlock.status === "completed") {
            setQuestionnaireComplete(true);
          } else {
            // If not complete, try to determine what question we're on
            const userMessages = blockMessages.filter(
              (m: { role: string }) => m.role === "user",
            ).length;
            setCurrentQuestionIndex(
              Math.min(
                userMessages,
                data.chat.service?.questionnaire?.length || 0,
              ),
            );

            // If we've already answered all questions but block isn't complete
            if (
              userMessages >= (data.chat.service?.questionnaire?.length || 0)
            ) {
              setQuestionnaireComplete(true);
            }
          }
        }
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch services and chat history on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch services
        const servicesResponse = await fetch(`/api/services`);
        const servicesData = await servicesResponse.json();

        if (servicesData.success) {
          setServices(servicesData.services);
        }

        // Fetch chat history
        const chatsResponse = await fetch(`/api/chats/me`);
        const chatsData = await chatsResponse.json();

        if (chatsData.success) {
          setChats(chatsData.chats);

          // Organize chats by date
          const chatsByDateObj: Record<string, Chat[]> = {};

          // Last 7 days
          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 7);

          // Last 30 days
          const last30Days = new Date();
          last30Days.setDate(last30Days.getDate() - 30);

          chatsData.chats.forEach((chat: Chat) => {
            const chatDate = new Date(chat.createdAt);

            if (chatDate > last7Days) {
              if (!chatsByDateObj["Previous 7 Days"]) {
                chatsByDateObj["Previous 7 Days"] = [];
              }
              chatsByDateObj["Previous 7 Days"].push(chat);
            } else if (chatDate > last30Days) {
              if (!chatsByDateObj["Previous 30 Days"]) {
                chatsByDateObj["Previous 30 Days"] = [];
              }
              chatsByDateObj["Previous 30 Days"].push(chat);
            } else {
              // Group by month
              const monthYear = chatDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              });
              if (!chatsByDateObj[monthYear]) {
                chatsByDateObj[monthYear] = [];
              }
              chatsByDateObj[monthYear].push(chat);
            }
          });

          setChatsByDate(chatsByDateObj);
        }

        // Check for serviceId in URL
        const serviceId = searchParams.get("serviceId");
        const chatIdParam = searchParams.get("chatId");

        if (serviceId) {
          setSelectedServiceId(serviceId);

          // Find the service
          const selectedService = servicesData.services.find(
            (s: Service) => s.id === serviceId,
          );
          if (selectedService) {
            setService(selectedService);
            setIsNewChat(true);

            // If there's also a chatId, load that chat
            if (chatIdParam) {
              await loadExistingChat(chatIdParam);
              setIsNewChat(false);
            } else {
              // Initialize with welcome message
              setMessages([
                {
                  role: "assistant",
                  content: `Welcome to ${selectedService.name}! How can I help you today?`,
                  timestamp: new Date(),
                },
              ]);
            }
          }
        }
      } catch (error) {
        ClientSideErrorHandler(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId, searchParams, loadExistingChat]);

  // Select a chat
  const selectChat = async (chat: Chat) => {
    await loadExistingChat(chat.id);
    setIsNewChat(false);

    // Set the service based on the chat's serviceId
    const chatService = services.find((s) => s.id === chat.serviceId);
    setService(chatService || null);

    // Update URL without redirect
    const params = new URLSearchParams();
    params.set("serviceId", chat.serviceId);
    params.set("chatId", chat.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Select a block
  const selectBlock = (block: Block) => {
    setCurrentBlock(block);
    setMessages(block.messages || []);
  };

  // Create a new block in the current chat
  const createNewBlock = async () => {
    if (!chatId) return;

    try {
      const response = await fetch(`/api/chats/${chatId}/block`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        // Update the block with messages array if it doesn't exist
        const newBlock = {
          ...data.block,
          messages: data.block.messages || [],
        };

        // Set current block first to trigger focus in MessageList
        setCurrentBlock(newBlock);

        // Then update blocks array - add the new block at the beginning
        setBlocks((prev) => [newBlock, ...prev]);

        setMessages(newBlock.messages);
        setCurrentQuestionIndex(0);
        setQuestionnaireComplete(false);
        setUploadedFiles([]);
        // setFormData({});

        // Add first question message
        if (service?.questionnaire && service.questionnaire.length > 0) {
          const firstQuestion = service.questionnaire[0];
          const assistantMessage: Message = {
            role: "assistant",
            content: `${firstQuestion.label}${firstQuestion.required ? " (Required)" : ""}`,
            timestamp: new Date(),
          };

          // Save the message to the block
          const success = await saveMessageToBlock(
            data.block.id,
            assistantMessage,
          );

          if (success) {
            // Update local messages
            setMessages([assistantMessage]);

            // Update the block in the blocks array
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === data.block.id
                  ? { ...b, messages: [assistantMessage] }
                  : b,
              ),
            );

            // Update current block
            setCurrentBlock((prev) =>
              prev && prev.id === data.block.id
                ? { ...prev, messages: [assistantMessage] }
                : prev,
            );
          }
        } else {
          // Generic welcome message if no questionnaire
          const welcomeMessage: Message = {
            role: "assistant",
            content: "How can I help you with your next request?",
            timestamp: new Date(),
          };

          // Save the message to the block
          const success = await saveMessageToBlock(
            data.block.id,
            welcomeMessage,
          );

          if (success) {
            // Update local messages
            setMessages([welcomeMessage]);

            // Update the block in the blocks array
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === data.block.id
                  ? { ...b, messages: [welcomeMessage] }
                  : b,
              ),
            );

            // Update current block
            setCurrentBlock((prev) =>
              prev && prev.id === data.block.id
                ? { ...prev, messages: [welcomeMessage] }
                : prev,
            );
          }
        }

        // Force scroll to the new block after a short delay
        setTimeout(() => {
          if (messagesEndRef?.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };

  // Update block status
  const updateBlockStatus = async (
    blockId: string,
    status: "completed" | "in_progress",
  ) => {
    if (!chatId) return;

    try {
      const response = await fetch(`/api/chats/${chatId}/block/${blockId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        // Update blocks list and trigger a re-render
        const updatedBlocks = blocks.map((block) => {
          if (block.id === blockId) {
            // Preserve all existing properties including prediction
            return { ...block, status };
          }
          return block;
        });

        // Update the blocks state
        setBlocks(updatedBlocks);

        // If the current block was updated, also update currentBlock state
        if (currentBlock && currentBlock.id === blockId) {
          setCurrentBlock({ ...currentBlock, status });
        }
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };

  // Save message to block
  const saveMessageToBlock = async (blockId: string, message: Message) => {
    if (!chatId || !blockId) return false;

    try {
      const response = await fetch(
        `/api/chats/${chatId}/block/${blockId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              role: message.role,
              content: message.content,
              timestamp: message.timestamp,
              fileData: message.fileData,
            },
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to save message to block");
        return false;
      }

      // If the API returns the updated block, update our local state
      if (data.block) {
        // Update the current block if it's the one we just modified
        if (currentBlock && currentBlock.id === blockId) {
          setCurrentBlock(data.block);
        }

        // Update the block in the blocks array
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? data.block : b)),
        );
      }

      return data.success as boolean;
    } catch (error) {
      ClientSideErrorHandler(error);
      return false;
    }
  };

  // Create a new chat
  const createNewChat = async (serviceId: string) => {
    if (!serviceId || !userId) return;

    setUploadedFiles([]);

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          userId,
          title: `New Chat`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChatId(data.chat.id);

        // Ensure the block has a messages array
        const newBlock = {
          ...data.block,
          status: "in_progress",
          messages: data.block.messages || [],
        };

        // Set current block first to trigger focus
        setCurrentBlock(newBlock);

        // Then update blocks array
        setBlocks([newBlock]);

        // Add to chats list
        const newChat = {
          id: data.chat.id,
          title: data.chat.title,
          createdAt: new Date().toISOString(),
          serviceId,
          blocks: [newBlock],
        };

        setChats((prev) => [newChat, ...prev]);

        // Add to chatsByDate
        setChatsByDate((prev) => {
          const newChatsByDate = { ...prev };
          if (!newChatsByDate["Previous 7 Days"]) {
            newChatsByDate["Previous 7 Days"] = [];
          }
          newChatsByDate["Previous 7 Days"] = [
            newChat,
            ...newChatsByDate["Previous 7 Days"],
          ];
          return newChatsByDate;
        });

        // Update URL without redirect
        const params = new URLSearchParams();
        params.set("serviceId", serviceId);
        params.set("chatId", data.chat.id);
        router.push(`?${params.toString()}`, { scroll: false });

        setIsNewChat(false);

        // Set the service immediately
        const selectedService = services.find((s) => s.id === serviceId);
        setService(selectedService || null);

        // Ask the first question if there's a questionnaire
        if (
          selectedService?.questionnaire &&
          selectedService.questionnaire.length > 0
        ) {
          const firstQuestion = selectedService.questionnaire[0];
          const assistantMessage: Message = {
            role: "assistant",
            content: `${firstQuestion.label}${firstQuestion.required ? " (Required)" : ""}`,
            timestamp: new Date(),
          };

          // Save the message to the block
          const success = await saveMessageToBlock(
            data.block.id,
            assistantMessage,
          );

          if (success) {
            // Update local messages
            setMessages([assistantMessage]);

            // Update the block in the blocks array
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === data.block.id
                  ? { ...b, messages: [assistantMessage] }
                  : b,
              ),
            );

            // Update current block
            setCurrentBlock((prev) =>
              prev && prev.id === data.block.id
                ? { ...prev, messages: [assistantMessage] }
                : prev,
            );
          }
        } else {
          // Generic welcome message if no questionnaire
          const welcomeMessage: Message = {
            role: "assistant",
            content: `Welcome to ${selectedService?.name || "the chat"}! How can I help you today?`,
            timestamp: new Date(),
          };

          // Save the message to the block
          const success = await saveMessageToBlock(
            data.block.id,
            welcomeMessage,
          );

          if (success) {
            // Update local messages
            setMessages([welcomeMessage]);

            // Update the block in the blocks array
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === data.block.id
                  ? { ...b, messages: [welcomeMessage] }
                  : b,
              ),
            );

            // Update current block
            setCurrentBlock((prev) =>
              prev && prev.id === data.block.id
                ? { ...prev, messages: [welcomeMessage] }
                : prev,
            );
          }
        }
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };

  // Send message
  const sendMessage = async () => {
    // Ensure we have content to send
    const hasContent =
      input.trim() ||
      uploadedFiles.length > 0 ||
      selectedDate ||
      selectedOptions.length > 0;

    if (!hasContent && !questionnaireComplete) {
      return;
    }

    try {
      setSending(true);

      // Get current field
      const currentField = service?.questionnaire?.[currentQuestionIndex];

      // Prepare message content based on field type
      let messageContent = "";

      if (currentField) {
        switch (currentField.type) {
          case "text":
          case "email":
          case "textarea":
          case "number":
            messageContent = input.trim();
            break;
          case "date":
            messageContent = selectedDate ? format(selectedDate, "PPP") : "";
            break;
          case "dropdown":
            messageContent = input.trim();
            break;
          case "checkbox":
            messageContent =
              selectedOptions.length > 0 ? selectedOptions.join(", ") : "";
            break;
          case "radio":
            messageContent = input.trim();
            break;
          case "file":
            messageContent = uploadedFiles.length ? uploadedFiles[0].name : "";
            break;
          default:
            messageContent = input.trim();
        }
      } else {
        messageContent = input.trim();
      }

      // Only set "No input provided" if messageContent is still empty
      if (!messageContent) {
        // if all questionnaire are attempted then type a custom message otherwise type "No input provided"
        if (currentQuestionIndex === service?.questionnaire?.length) {
          messageContent = "Please predict";
        } else {
          messageContent = "No input provided";
        }
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        role: "user",
        content: messageContent,
        timestamp: new Date(),
      };

      // If it's a file, add file data to the message
      if (currentField?.type === "file" && uploadedFiles.length) {
        userMessage.fileData = {
          url: uploadedFiles[0].url,
          name: uploadedFiles[0].name,
          type: uploadedFiles[0].type,
        };
      }

      // Update UI with user message
      setMessages((prev) => [...prev.filter((m) => !m.isPreview), userMessage]);

      // If this is a new chat, create it first
      if (isNewChat && selectedServiceId) {
        await createNewChat(selectedServiceId);
        setIsNewChat(false);
      } else if (currentBlock) {
        // Save user message to existing block
        const success = await saveMessageToBlock(currentBlock.id, userMessage);

        if (success && currentBlock) {
          // Update the current block with the new message
          const updatedMessages = [
            ...(currentBlock.messages || []),
            userMessage,
          ];

          // Update the current block
          setCurrentBlock((prev) =>
            prev ? { ...prev, messages: updatedMessages } : prev,
          );

          // Update the block in the blocks array
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === currentBlock.id
                ? { ...b, messages: updatedMessages }
                : b,
            ),
          );
        }
      }

      // Reset inputs
      setInput("");
      setSelectedDate(undefined);
      setSelectedOptions([]);

      // Keep file reference for API call but clear UI
      const fileUrl = uploadedFiles.length ? uploadedFiles[0].url : null;
      const fileName = uploadedFiles.length ? uploadedFiles[0].name : null;
      const fileType = uploadedFiles.length ? uploadedFiles[0].type : null;

      // Process questionnaire
      if (
        service?.questionnaire &&
        currentQuestionIndex < service.questionnaire.length
      ) {
        const currentField = service.questionnaire[currentQuestionIndex];

        // Save answer to form data
        let fieldValue: any = messageContent;

        // Format the value based on field type
        if (currentField.type === "number") {
          fieldValue = Number.parseFloat(messageContent);
        } else if (currentField.type === "checkbox") {
          fieldValue = selectedOptions;
        } else if (currentField.type === "date") {
          fieldValue = selectedDate ? selectedDate.toISOString() : null;
        } else if (currentField.type === "file") {
          fieldValue = fileUrl;
        }

        // setFormData((prev) => ({
        //   ...prev,
        //   [currentField.name]: fieldValue,
        // }));

        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);

        if (nextIndex < service.questionnaire.length) {
          // Ask next question
          const nextQuestion = service.questionnaire[nextIndex];
          const assistantMessage: Message = {
            role: "assistant",
            content: `${nextQuestion.label}${nextQuestion.required ? " (Required)" : ""}`,
            timestamp: new Date(),
          };

          // Save assistant message to block
          if (currentBlock) {
            const success = await saveMessageToBlock(
              currentBlock.id,
              assistantMessage,
            );

            if (success) {
              // Update UI with assistant message
              setMessages((prev) => [...prev, assistantMessage]);

              // Update the current block with the new message
              if (currentBlock) {
                const updatedMessages = [
                  ...(currentBlock.messages || []),
                  assistantMessage,
                ];

                // Update the current block
                setCurrentBlock((prev) =>
                  prev ? { ...prev, messages: updatedMessages } : prev,
                );

                // Update the block in the blocks array
                setBlocks((prev) =>
                  prev.map((b) =>
                    b.id === currentBlock.id
                      ? { ...b, messages: updatedMessages }
                      : b,
                  ),
                );
              }
            }
          }

          setSending(false);
          return;
        } else {
          // All questions answered, mark as ready for submission
          setQuestionnaireComplete(true);

          // Show completion message
          const completionMessage: Message = {
            role: "assistant",
            content:
              "Thank you for providing all the information! Click submit to process your request.",
            timestamp: new Date(),
          };

          // Save completion message to block
          if (currentBlock) {
            const success = await saveMessageToBlock(
              currentBlock.id,
              completionMessage,
            );

            if (success) {
              // Update UI with completion message
              setMessages((prev) => [...prev, completionMessage]);

              // Update the current block with the new message
              if (currentBlock) {
                const updatedMessages = [
                  ...(currentBlock.messages || []),
                  completionMessage,
                ];

                // Update the current block
                setCurrentBlock((prev) =>
                  prev ? { ...prev, messages: updatedMessages } : prev,
                );

                // Update the block in the blocks array
                setBlocks((prev) =>
                  prev.map((b) =>
                    b.id === currentBlock.id
                      ? { ...b, messages: updatedMessages }
                      : b,
                  ),
                );
              }
            }
          }

          setSending(false);
          return;
        }
      }

      // If questionnaire is complete, send to prediction API
      if (questionnaireComplete) {
        // Show loading message
        const loadingMessage: Message = {
          role: "assistant",
          content: "Processing your request...",
          timestamp: new Date(),
        };

        // Update UI with loading message
        setMessages((prev) => [...prev, loadingMessage]);

        // Update the current block with the loading message
        if (currentBlock) {
          const updatedMessages = [
            ...(currentBlock.messages || []),
            loadingMessage,
          ];

          // Update the current block
          setCurrentBlock((prev) =>
            prev ? { ...prev, messages: updatedMessages } : prev,
          );

          // Update the block in the blocks array
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === currentBlock.id
                ? { ...b, messages: updatedMessages }
                : b,
            ),
          );
        }

        // Generate prediction
        try {
          const predictionResponse = await axios.post("/api/predict", {
            // itemDetails: formData,
            context: messages,
            images: fileUrl ? [fileUrl] : [], // Keep this for backward compatibility
            imageUrls: fileUrl ? [fileUrl] : [], // Add this line to use the secure_url directly
            blockId: currentBlock?.id,
            chatId,
          });

          if (predictionResponse.data.success) {
            const predictionMessage: Message = {
              role: "assistant",
              content: predictionResponse.data.prediction?.text || "",
              timestamp: new Date(),
            };

            // Save prediction message to block
            if (currentBlock) {
              const success = await saveMessageToBlock(
                currentBlock.id,
                predictionMessage,
              );

              if (success) {
                // Update UI with prediction message (replace loading message)
                setMessages((prev) => [
                  ...prev.slice(0, -1),
                  predictionMessage,
                ]);

                // Update the current block with the prediction message (replace loading message)
                if (currentBlock) {
                  const updatedMessages = [
                    ...(currentBlock.messages || []).slice(0, -1),
                    predictionMessage,
                  ];

                  // Get the prediction data
                  const predictionData =
                    predictionResponse.data.prediction?.json || null;

                  // Update the current block with both messages and prediction
                  setCurrentBlock((prev) =>
                    prev
                      ? {
                          ...prev,
                          messages: updatedMessages,
                          prediction: predictionData,
                        }
                      : prev,
                  );

                  // Update the block in the blocks array with both messages and prediction
                  setBlocks((prev) =>
                    prev.map((b) =>
                      b.id === currentBlock.id
                        ? {
                            ...b,
                            messages: updatedMessages,
                            prediction: predictionData,
                          }
                        : b,
                    ),
                  );

                  // Mark block as completed - this is where we need to ensure the UI updates
                  await updateBlockStatus(currentBlock.id, "completed");

                  // Force a re-render of the blocks with the updated status and prediction
                  setBlocks((prev) =>
                    prev.map((b) =>
                      b.id === currentBlock.id
                        ? {
                            ...b,
                            status: "completed",
                            prediction: predictionData,
                          }
                        : b,
                    ),
                  );
                }
              }
            }

            setSending(false);
          }
        } catch (error) {
          ClientSideErrorHandler(error);
          const errorMessage: Message = {
            role: "assistant",
            content:
              "Sorry, I encountered an error while processing your request. Please try again.",
            timestamp: new Date(),
          };

          // Save error message to block
          if (currentBlock) {
            const success = await saveMessageToBlock(
              currentBlock.id,
              errorMessage,
            );

            if (success) {
              // Update UI with error message (replace loading message)
              setMessages((prev) => [...prev.slice(0, -1), errorMessage]);

              // Update the current block with the error message (replace loading message)
              if (currentBlock) {
                const updatedMessages = [
                  ...(currentBlock.messages || []).slice(0, -1),
                  errorMessage,
                ];

                // Update the current block
                setCurrentBlock((prev) =>
                  prev ? { ...prev, messages: updatedMessages } : prev,
                );

                // Update the block in the blocks array
                setBlocks((prev) =>
                  prev.map((b) =>
                    b.id === currentBlock.id
                      ? { ...b, messages: updatedMessages }
                      : b,
                  ),
                );
              }
            }
          }

          setSending(false);
        }

        return;
      }

      // Handle generic message (not part of questionnaire)
      if (!service?.questionnaire || service.questionnaire.length === 0) {
        // Show typing indicator
        const typingMessage: Message = {
          role: "assistant",
          content: "Thinking...",
          timestamp: new Date(),
        };

        // Update UI with typing message
        setMessages((prev) => [...prev, typingMessage]);

        // Update the current block with the typing message
        if (currentBlock) {
          const updatedMessages = [
            ...(currentBlock.messages || []),
            typingMessage,
          ];

          // Update the current block
          setCurrentBlock((prev) =>
            prev ? { ...prev, messages: updatedMessages } : prev,
          );

          // Update the block in the blocks array
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === currentBlock.id
                ? { ...b, messages: updatedMessages }
                : b,
            ),
          );
        }

        // Send to API
        try {
          const response = await fetch(`/api/chats/${chatId}/message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: messageContent,
              blockId: currentBlock?.id,
              fileUrl,
              fileName,
              fileType,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Update messages with the latest from the server
            if (data.block && Array.isArray(data.block.messages)) {
              // Update UI with the server response
              setMessages(data.block.messages);

              // Update current block in state
              setCurrentBlock(data.block);

              // Update blocks array while preserving status
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === data.block.id
                    ? { ...data.block, status: b.status || "in_progress" }
                    : b,
                ),
              );
            }
          }
        } catch (error) {
          ClientSideErrorHandler(error);

          // Remove typing indicator and show error
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.content !== "Thinking...");
            return [
              ...filtered,
              {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
              },
            ];
          });

          // Update the current block by removing the typing message and adding an error message
          if (currentBlock) {
            const filteredMessages = (currentBlock.messages || []).filter(
              (m) => m.content !== "Thinking...",
            );

            const errorMessage = {
              role: "assistant" as const,
              content: "Sorry, I encountered an error. Please try again.",
              timestamp: new Date(),
            };

            const updatedMessages = [...filteredMessages, errorMessage];

            // Update the current block
            setCurrentBlock((prev) =>
              prev ? { ...prev, messages: updatedMessages } : prev,
            );

            // Update the block in the blocks array
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === currentBlock.id
                  ? { ...b, messages: updatedMessages }
                  : b,
              ),
            );
          }
        }
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    } finally {
      setSending(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      // Only process the first file
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newFile = {
          url: data.result.secure_url,
          name: file.name,
          type: file.type,
        };

        setUploadedFiles([newFile]);

        // If it's a file field, immediately show the file in the chat
        if (currentField?.type === "file") {
          // Create a temporary message to show the file
          const filePreviewMessage: Message = {
            role: "user",
            content: "Selected file:",
            fileData: newFile,
            timestamp: new Date(),
            isPreview: true, // Mark as preview so we can replace it when actually sending
          };

          setMessages((prev) => {
            // Filter out any previous preview messages
            const filteredMessages = prev.filter((m) => !m.isPreview);
            return [...filteredMessages, filePreviewMessage];
          });
        }
      }
    } catch (error) {
      ClientSideErrorHandler(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    } else if (
      e.type === "drop" &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      setDragActive(false);
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Get current field for input type
  const currentField = service?.questionnaire?.[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex h-[92svh] w-full overflow-hidden md:overflow-auto">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onOpenChange={() => setIsSidebarOpen((prev) => !prev)}
        services={services}
        chats={chats}
        setChats={setChats}
        chatsByDate={chatsByDate}
        setChatsByDate={setChatsByDate}
        currentService={service}
        currentChatId={chatId}
        currentBlock={currentBlock}
        blocks={blocks}
        onSelectChat={selectChat}
        onSelectBlock={selectBlock}
        onNewChat={createNewChat}
      />

      {/* Main Chat Area */}
      <section
        className={cn(
          "relative flex flex-1 flex-col transition-all duration-200",
          isSidebarOpen
            ? "pointer-events-none w-0 opacity-0 md:pointer-events-auto md:w-[70%] md:opacity-100 lg:w-[75%] xl:w-[80%]"
            : "w-full",
        )}
        ref={chatContainerRef}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrag}
      >
        {/* Header */}
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          service={service}
          currentBlock={currentBlock}
          onCreateNewBlock={createNewBlock}
          onDiscardBlock={() => {}}
        />

        {/* Messages */}
        <MessageList
          files={uploadedFiles}
          messages={messages}
          service={service}
          blocks={blocks}
          currentBlock={currentBlock}
          messagesEndRef={messagesEndRef}
          services={services}
          onSelectService={createNewChat}
        />

        {/* Input Area */}
        {/* Dynamic Input based on field type */}
        <DynamicInput
          services={services}
          onSelectService={createNewChat}
          currentField={currentField}
          input={input}
          setInput={setInput}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          sending={sending}
          onSend={sendMessage}
          fileUploading={uploading}
          onFileUpload={handleFileUpload}
          onDrag={handleDrag}
          dragActive={dragActive}
          service={service}
          currentBlock={currentBlock}
          createNewBlock={createNewBlock}
          allQuestionsAttempted={
            service?.questionnaire &&
            currentQuestionIndex >= service.questionnaire.length
          }
        />
      </section>
    </main>
  );
}
