type ErrorResponsePayload = {
  error?: unknown;
  message?: unknown;
};

export async function readErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as ErrorResponsePayload;

      if (typeof payload.error === "string" && payload.error.trim()) {
        return payload.error;
      }

      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }
    } catch {
      return fallbackMessage;
    }

    return fallbackMessage;
  }

  try {
    const text = await response.text();
    return text.trim() || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
