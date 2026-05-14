import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    if (status === 429) {
      return "The free AI model is rate limited right now. Wait a minute, then try again.";
    }

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (status && status >= 500) {
      return "The server could not finish the request. Please try again.";
    }

    if (error.code === "ERR_NETWORK") {
      return "The API is unreachable. Check that the backend server is running.";
    }
  }

  return fallback;
}
