import mongoose, { Schema } from "mongoose";

export const genderTypes = {
  male: "male",
  female: "female",
};

export const roleTypes = {
  admin: "admin",
  user: "user",
};
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      minLength: [3, "your username must be at least 3 character"],
      maxLength: [20, "your username must be at most 20 character"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      trim: true,

      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    gender: {
      type: String,
      enum: Object.values(genderTypes),
      message: "Gender must be either male or female",
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    phone: String,
    age: Number,
    DOB: Date,
    changedAt: Date,

    addresses: {
      homeAddress: {
        governorate: String,
        city: String,
        addressDetails: String,
        isDefault: { type: Boolean, default: true },
      },
      workAddress: {
        governorate: String,
        city: String,
        addressDetails: String,
        isDefault: { type: Boolean, default: false },
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    forgetPasswordOtp: String,
    confirmEmailOtp: String,
    changecredentials: Date,
  },

  { timestamps: true }
);
userSchema.pre("save", function (next) {
  if (this.DOB) {
    const ageDifMs = Date.now() - this.DOB.getTime();
    const ageDate = new Date(ageDifMs);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
