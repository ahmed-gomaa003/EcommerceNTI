import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    productDesc: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    isActivated: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  this.isActivated = this.stock > 0;
  next();
});
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.stock !== undefined) {
    update.isActivated = update.stock > 0;
  }

  next();
});

// create slug before save
productSchema.pre("save", function () {
  this.slug = slugify(this.productName, { lower: true });
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
