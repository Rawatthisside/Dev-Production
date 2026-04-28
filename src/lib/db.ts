import mongoose from "mongoose";

function getTargetDbName(uri: string) {
  const explicitDbName = process.env.MONGODB_DB_NAME?.trim();

  if (explicitDbName) {
    return explicitDbName;
  }

  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, "").trim();
    return dbName || undefined;
  } catch {
    return undefined;
  }
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const targetDbName = getTargetDbName(mongoUri);
  const currentDbName = mongoose.connection.db?.databaseName;

  if (
    mongoose.connection.readyState === 1 &&
    (!targetDbName || currentDbName === targetDbName)
  ) {
    return;
  }

  if (mongoose.connection.readyState === 1 && targetDbName && currentDbName !== targetDbName) {
    await mongoose.disconnect();
  }

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(mongoUri, targetDbName ? { dbName: targetDbName } : {});
    console.log(`MongoDB connected to ${mongoose.connection.db?.databaseName ?? "unknown"}`);
  } catch (error) {
    console.error(error);
    throw new Error("DB connection failed");
  }
};
