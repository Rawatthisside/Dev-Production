import { connectDB } from "@/lib/db";
import Udankaar from "@/models/Udankaar";

type RawUdankaarEntry = {
  _id: { toString(): string } | string;
  title?: string;
  slug?: string;
  photo?: string;
  youtubeLink?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export type PublicUdankaarEntry = {
  _id: string;
  title: string;
  slug: string;
  photo: string;
  youtubeLink: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

function toIsoString(value?: Date | string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toISOString();
}

function normalizeEntry(entry: RawUdankaarEntry): PublicUdankaarEntry {
  return {
    _id: String(entry._id),
    title: entry.title ?? "",
    slug: entry.slug ?? "",
    photo: entry.photo ?? "",
    youtubeLink: entry.youtubeLink ?? "",
    createdAt: toIsoString(entry.createdAt),
    updatedAt: toIsoString(entry.updatedAt),
    seo: entry.seo,
  };
}

export async function listUdankaarEntries() {
  await connectDB();

  const entries = await Udankaar.find()
    .sort({ createdAt: -1 })
    .lean<RawUdankaarEntry[]>();

  return entries.map(normalizeEntry);
}
