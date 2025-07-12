/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import DatePicker from "@/components/common/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Field, Service, UploadedFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Send, Upload } from "lucide-react";
import { useRef } from "react";
import FilePreview from "./file-preview";

type DynamicInputProps = {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  currentField: Field | undefined;
  input: string;
  setInput: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedOptions: string[];
  setSelectedOptions: (
    options: string[] | ((prev: string[]) => string[]),
  ) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (
    files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[]),
  ) => void;
  sending: boolean;
  onSend: () => void;
  fileUploading: boolean;
  onFileUpload: (files: FileList | null) => void;
  onDrag: (e: React.DragEvent) => void;
  dragActive: boolean;
  service: any | null;
  currentBlock: any | null;
  createNewBlock: () => void;
  allQuestionsAttempted?: boolean;
};

export default function DynamicInput({
  currentField,
  input,
  setInput,
  selectedDate,
  setSelectedDate,
  selectedOptions,
  setSelectedOptions,
  uploadedFiles,
  setUploadedFiles,
  sending,
  onSend,
  fileUploading,
  onFileUpload,
  onDrag,
  dragActive,
  service,
  currentBlock,
  createNewBlock,
  allQuestionsAttempted = false,
}: DynamicInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle checkbox change
  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev: string[]) => {
      if (prev.includes(option)) {
        return prev.filter((item: string) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // Remove a file from the uploaded files
  const removeFile = (index: number) => {
    setUploadedFiles((prev: UploadedFile[]) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  // Check if the input is disabled
  const isInputDisabled =
    sending || !service || currentBlock?.status === "completed";

  // Show submit button if all questions are attempted or questionnaire is complete
  const showSubmitButton = allQuestionsAttempted;

  if (!currentField) {
    return (
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* <Input
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={isInputDisabled}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={isInputDisabled}
          size="icon"
          className="h-10 w-10 flex-shrink-0 rounded-full"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button> */}
        {currentBlock?.status === "completed" ? (
          <Button onClick={createNewBlock} className="m-3.5 w-full">
            Create new block
          </Button>
        ) : showSubmitButton ? (
          <Button
            onClick={onSend}
            disabled={isInputDisabled}
            className="m-3.5 w-full"
          >
            Submit
          </Button>
        ) : // <div className="flex w-full gap-x-2 overflow-scroll scrollbar-hide">
        //   {services.map((s) => (
        //     <Button
        //       key={s.id}
        //       variant={"ghost"}
        //       className="w-fit justify-start text-sm"
        //       onClick={() => onSelectService(s.id)}
        //     >
        //       {s.icon ? (
        //         <span className="mr-2">{s.icon}</span>
        //       ) : (
        //         <Sparkles size={16} className="mr-2" />
        //       )}
        //       {s.name}
        //     </Button>
        //   ))}
        // </div>
        null}
      </div>
    );
  }

  const renderFieldInput = () => {
    switch (currentField.type) {
      case "text":
      case "email":
        return (
          <Input
            placeholder={`Enter ${currentField.label.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type={currentField.type}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={sending}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${currentField.label.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            className="resize-none border-none outline-none focus:border-none focus-visible:ring-[0px] dark:bg-transparent"
          />
        );
      case "number":
        return (
          <Input
            placeholder={`Enter ${currentField.label.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={sending}
          />
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
                disabled={sending}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "PPP")
                  : `Select ${currentField.label.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <DatePicker
                selected={selectedDate || new Date()}
                onSelect={setSelectedDate}
                startYear={1950}
                endYear={2100}
              />
            </PopoverContent>
          </Popover>
        );
      case "dropdown":
        return (
          <Select onValueChange={(value) => setInput(value)} disabled={sending}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`Select ${currentField.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {currentField.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {currentField.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option}`}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                  disabled={sending}
                />
                <Label htmlFor={`option-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => setInput(value)}
            disabled={sending}
          >
            <div className="space-y-2">
              {currentField.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${option}`} />
                  <Label htmlFor={`radio-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
      case "file":
        return (
          <div
            className={`absolute left-0 top-0 w-full -translate-y-[100%] rounded-lg border-2 border-dashed p-4 text-center dark:bg-black/80 md:top-1/2 ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20"
            }`}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrag}
          >
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending || uploadedFiles.length > 0}
              className="mb-2"
            >
              {fileUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploadedFiles.length > 0
                ? "File Selected"
                : `${currentField.label}`}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => onFileUpload(e.target.files)}
              accept="image/*"
            />
            {uploadedFiles.length > 0 ? (
              <FilePreview
                uploadedFiles={uploadedFiles}
                onRemoveFile={(index) => {
                  removeFile(index);
                }}
              />
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Drag and drop a file here or click to browse
              </p>
            )}
          </div>
        );
      default:
        return (
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={sending}
          />
        );
    }
  };

  return (
    <footer
      className={cn(
        "relative grid max-w-2xl place-items-center px-3 max-md:py-3 md:absolute md:bottom-0 md:left-0 md:right-0 md:mx-auto md:h-32 md:bg-background md:shadow-lg xl:max-w-4xl",
      )}
    >
      <div className="flex w-full items-end gap-x-2">
        <div className="flex-1">
          {currentBlock?.status === "completed" ? (
            <Button onClick={createNewBlock} className="w-full">
              Create new block
            </Button>
          ) : (
            renderFieldInput()
          )}
        </div>

        {currentField.type !== "file" && !showSubmitButton && (
          <Button
            onClick={onSend}
            disabled={isInputDisabled}
            size="icon"
            className="h-10 w-10 flex-shrink-0 rounded-full"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {(currentField.type === "file" || showSubmitButton) && (
        <Button
          onClick={onSend}
          disabled={
            sending ||
            !service ||
            currentBlock?.status === "completed" ||
            (currentField.type === "file" && uploadedFiles.length === 0)
          }
        >
          {sending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {showSubmitButton ? "Submit" : "Upload and Send"}
        </Button>
      )}
    </footer>
  );
}
