import { ApplicationEnvironment } from "@/lib/constants";
import { env } from "@/lib/env";
import { AxiosError } from "axios";

import { toast } from "sonner";

interface AxiosErrorResponse {
  success: boolean;
  message: string;
}

const ClientSideErrorHandler = (error: unknown) => {
  // Log the error for debugging purposes
  if (env.NEXT_PUBLIC_NODE_ENV === ApplicationEnvironment.DEVELOPMENT) {
    console.log("Client-side error:", error);
  }

  if (error instanceof AxiosError) {
    // Handle Axios errors including network errors and no response received
    if (error.response) {
      // Error from server with a response payload
      const response: AxiosErrorResponse = error.response.data;
      toast.error(response.message || "An error occurred on the server");
    } else if (error.request) {
      // Request made but no response received
      toast.error("No response received from the server");
    } else {
      // Something happened in setting up the request
      toast.error("Network error occurred");
    }
  } else if (typeof error === "string") {
    // Handle errors as simple strings
    toast.error(error);
  } else if (error instanceof Error) {
    // Handle generic error objects not caught by AxiosError
    toast.error(error.message || "An unexpected error occurred");
  } else {
    // Fallback error message for any other cases
    toast.error("An unexpected error occurred");
  }
};

export default ClientSideErrorHandler;
