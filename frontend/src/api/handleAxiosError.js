// utils/handleAxiosError.js

import axios from "axios";

export function handleAxiosError(error) {
  // Axios-specific errors
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Response(
        error.response.data?.message ||
          error.response.statusText ||
          "Request failed.",
        {
          status: error.response.status,
          statusText: error.response.statusText,
        }
      );
    }

    // Request was sent but no response received
    if (error.request) {
      throw new Response(
        error.message ||
          "Network error. Please check your internet connection or try again later.",
        {
          status: 503,
          statusText: "Service Unavailable",
        }
      );
    }

    // Axios failed before sending the request
    throw new Response(error.message || "Failed to create request.", {
      status: 500,
      statusText: "Internal Error",
    });
  }

  // Already a Response? Pass it through.
  if (error instanceof Response) {
    throw error;
  }

  // Normal JavaScript Error
  if (error instanceof Error) {
    throw new Response(error.message, {
      status: 500,
      statusText: "Internal Error",
    });
  }

  // Unknown error type
  throw new Response("An unexpected error occurred.", {
    status: 500,
    statusText: "Internal Error",
  });
}
