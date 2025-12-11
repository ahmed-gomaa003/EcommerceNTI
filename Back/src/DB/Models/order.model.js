import mongoose, { Schema, Types } from "mongoose";
import { customAlphabet } from "nanoid";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    RecipientsName: String,
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    shippingPrice: {
      type: Number,
      default: 50,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    isCancelled: { type: Boolean, default: false },

    trackingNumber: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

// generate tracking number automatically
const generateTracking = customAlphabet("0123456789", 9);

orderSchema.pre("save", function () {
  if (!this.trackingNumber) {
    this.trackingNumber = generateTracking();
  }
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
