import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    image: String,

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
