"use client";

import { Button } from "@/components/ui/button";
import ClientSideErrorHandler from "@/lib/helpers/errors/client";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    ClientSideErrorHandler(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <h2 className="mb-4 text-4xl font-bold">Something went wrong!</h2>
      <p className="mb-8 text-xl text-muted-foreground">
        An error occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
