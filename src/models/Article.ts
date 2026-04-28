import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: String,
    coverImagePublicId: String,

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },

    seo: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

// optional search index
ArticleSchema.index({
  "seo.title": "text",
  "seo.description": "text",
});

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);