import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default subCategoryModel;
