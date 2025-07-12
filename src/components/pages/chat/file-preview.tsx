"use client";

import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/lib/types";
import { Upload, X } from "lucide-react";
import Image from "next/image";

type FilePreviewProps = {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
};

export default function FilePreview({
  uploadedFiles,
  onRemoveFile,
}: FilePreviewProps) {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 py-2">
      {uploadedFiles.map((file, index) => (
        <div
          key={index}
          className="bg-muted group relative flex items-center rounded-md p-2"
        >
          {file.type.startsWith("image/") ? (
            <div className="mr-2 h-12 w-12 overflow-hidden rounded">
              <Image
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="h-full w-full object-cover"
                height={48}
                width={48}
                unoptimized
              />
            </div>
          ) : (
            <div className="bg-primary/10 mr-2 flex h-12 w-12 items-center justify-center rounded">
              <Upload className="text-primary h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onRemoveFile(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
