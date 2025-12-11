import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";

const testinomialSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const testinomialModel = mongoose.model("Testinomial", testinomialSchema);
export default testinomialModel;
