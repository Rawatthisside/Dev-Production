import mongoose from "mongoose";

type CreateApiErrorResponseOptions = {
  context: string;
  fallbackMessage: string;
  duplicateKeyMessage?: string;
  invalidRequestMessage?: string;
};

type MongoServerErrorLike = {
  code?: number;
};

function isMongoServerErrorLike(error: unknown): error is MongoServerErrorLike {
  return typeof error === "object" && error !== null;
}

function getValidationMessage(error: mongoose.Error.ValidationError) {
  const messages = Object.values(error.errors)
    .map((item) => item.message.trim())
    .filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  return messages.join(", ");
}

export function createApiErrorResponse(
  error: unknown,
  {
    context,
    fallbackMessage,
    duplicateKeyMessage = "Record already exists",
    invalidRequestMessage = "Invalid request data",
  }: CreateApiErrorResponseOptions,
) {
  console.error(`[${context}]`, error);

  if (error instanceof SyntaxError) {
    return Response.json({ error: invalidRequestMessage }, { status: 400 });
  }

  if (error instanceof mongoose.Error.CastError) {
    return Response.json({ error: invalidRequestMessage }, { status: 400 });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return Response.json(
      { error: getValidationMessage(error) ?? invalidRequestMessage },
      { status: 400 },
    );
  }

  if (isMongoServerErrorLike(error) && error.code === 11000) {
    return Response.json({ error: duplicateKeyMessage }, { status: 409 });
  }

  return Response.json({ error: fallbackMessage }, { status: 500 });
}
