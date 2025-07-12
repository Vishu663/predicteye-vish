"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientSideErrorHandler from "@/lib/helpers/errors/client";
import type { Block, Chat, Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  SidebarIcon,
  Sparkles,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type SidebarProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  services: Service[];
  chats: Chat[];
  setChats: (chats: any) => void;
  chatsByDate: Record<string, Chat[]>;
  setChatsByDate: (chatsByDate: any) => void;
  currentService: Service | null;
  currentChatId: string | null;
  currentBlock: { id: string; status?: string } | null;
  blocks: Block[];
  onSelectChat: (chat: Chat) => void;
  onSelectBlock: (block: Block) => void;
  onNewChat: (serviceId: string) => void;
};

export default function Sidebar({
  isOpen,
  onOpenChange,
  services,
  chatsByDate,
  setChatsByDate,
  currentService,
  currentChatId,
  // currentBlock,
  // blocks,
  // onSelectService,
  onSelectChat,
  // onSelectBlock,
  onNewChat,
}: SidebarProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<Chat | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Filter chats by search query
  const filteredChatsByDate = () => {
    if (!searchQuery.trim()) return chatsByDate;

    const filtered: Record<string, Chat[]> = {};

    Object.entries(chatsByDate).forEach(([date, chats]) => {
      const matchingChats = chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (matchingChats.length > 0) {
        filtered[date] = matchingChats;
      }
    });

    return filtered;
  };

  const handleRenameChat = async () => {
    if (!chatToRename) return;

    try {
      const response = await fetch(`/api/chats/${chatToRename.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newChatTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename chat");
      }

      // Update chat title in state
      setChatsByDate((prev: any) => {
        const updatedChatsByDate = { ...prev };

        // Update the chat title in all date categories
        Object.keys(updatedChatsByDate).forEach((date) => {
          updatedChatsByDate[date] = updatedChatsByDate[date].map(
            (chat: Chat) =>
              chat.id === chatToRename.id
                ? { ...chat, title: newChatTitle }
                : chat,
          );
        });

        return updatedChatsByDate;
      });

      // Close the dialog and reset state
      setIsRenameDialogOpen(false);
      setChatToRename(null);
      setNewChatTitle("");
    } catch (error) {
      ClientSideErrorHandler(error);
    }
  };
  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r bg-muted/10 transition-all duration-200",
        isOpen
          ? "w-screen translate-x-0 md:w-[30%] lg:w-[25%] xl:w-[20%]"
          : "w-0 -translate-x-48",
      )}
    >
      {/* New Chat Button */}
      <div className="border-b p-3.5">
        <Button
          onClick={() => onNewChat(currentService?.id || "")}
          className="flex w-full items-center gap-2"
          variant="outline"
          disabled={!currentService}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Services Section */}
      {/* <div className="border-b p-3">
        <h3 className="mb-2 text-sm font-medium">Services</h3>
        <ScrollArea className="h-[120px]">
          <div className="space-y-1">
            {services.map((s) => (
              <Button
                key={s.id}
                variant={currentService?.id === s.id ? "secondary" : "ghost"}
                className="w-full justify-start truncate text-sm"
                onClick={() => onNewChat(s.id)}
              >
                {s.icon ? <span>{s.icon}</span> : <Sparkles size={16} />}
                {s.name.replace(" Prediction", "")}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div> */}
      <div className="border-b p-3">
        <h3 className="mb-2 text-sm font-medium">Services</h3>
        <ScrollArea className="h-[120px]">
          <div className="space-y-2">
            {services.map((s) => (
              <Button
                key={s.id}
                variant={currentService?.id === s.id ? "secondary" : "outline"}
                className={cn(
                  "w-full justify-start truncate text-sm font-semibold transition-all",
                  currentService?.id === s.id
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/80"
                    : "bg-muted/20 hover:bg-muted/30",
                )}
                onClick={() => onNewChat(s.id)}
              >
                {s.icon ? (
                  <span className="mr-2">{s.icon}</span>
                ) : (
                  <Sparkles size={16} className="mr-2" />
                )}
                <span className="truncate">
                  {s.name.replace(" Prediction", "")}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Search */}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="h-full">
        <div className="space-y-6 p-3">
          {Object.entries(filteredChatsByDate()).length > 0 ? (
            Object.entries(filteredChatsByDate()).map(([date, dateChats]) => (
              <div key={date}>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                  {date}
                </h3>
                <div className="space-y-1">
                  {dateChats.map((chat) => (
                    <div key={chat.id} className="group relative">
                      <Button
                        variant={
                          currentChatId === chat.id ? "secondary" : "ghost"
                        }
                        className="w-full justify-start text-sm"
                        onClick={() => onSelectChat(chat)}
                      >
                        <MessageSquare size={16} />
                        <span className="mr-1 truncate">{chat.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="absolute right-0 top-0 z-10 grid h-full w-auto place-items-center rounded-r-md p-1 text-white/70 opacity-0 hover:bg-black hover:text-white group-hover:opacity-100">
                              <MoreVertical size={14} />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToRename(chat);
                                setNewChatTitle(chat.title);
                                setIsRenameDialogOpen(true);
                              }}
                            >
                              Rename
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No chat history found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="flex flex-shrink-0 items-center border-y px-3 py-3.5">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <User size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {session?.user?.name || "User"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onOpenChange}>
          <SidebarIcon size={16} />
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameDialogOpen(false);
                setChatToRename(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameChat} disabled={!newChatTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
