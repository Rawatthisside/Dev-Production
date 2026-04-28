import mongoose from "mongoose";

const UdankaarSchema = new mongoose.Schema(
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
    photo: String,
    photoPublicId: String,
    youtubeLink: {
      type: String,
      trim: true,
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

UdankaarSchema.index({
  title: "text",
  "seo.title": "text",
  "seo.description": "text",
});

export default mongoose.models.Udankaar ||
  mongoose.model("Udankaar", UdankaarSchema);
