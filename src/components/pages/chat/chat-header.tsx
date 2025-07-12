"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Block, Service } from "@/lib/types";
import { CheckCircle, MoreVertical, Plus, Sidebar } from "lucide-react";

type ChatHeaderProps = {
  service: Service | null;
  currentBlock: Block | null;
  onCreateNewBlock: () => void;
  onDiscardBlock: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function ChatHeader({
  service,
  currentBlock,
  onCreateNewBlock,
  toggleSidebar,
  isSidebarOpen,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-3.5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Sidebar size={20} />
        </Button>
        <h2 className="font-medium">{service?.name || "Select a Service"}</h2>
        {currentBlock && (
          <div className="ml-4 flex items-center text-sm">
            <span className="text-muted-foreground">|</span>
            <span className="ml-4 font-medium">{currentBlock.title}</span>
            {currentBlock.status === "completed" && (
              <span className="ml-2 flex items-center gap-1 text-green-500">
                <CheckCircle size={14} /> Completed
              </span>
            )}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={!currentBlock}>
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onCreateNewBlock}>
            <Plus size={14} className="mr-2" /> New Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
