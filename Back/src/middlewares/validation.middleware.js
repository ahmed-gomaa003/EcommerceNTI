import joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/Models/user.model.js";
export const isValidObjectID = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("In-valid Id");
};
export const generalfields = {
  UserName: joi.string().min(3).max(30),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi.string(),
  confirmPassword: joi.string().valid(joi.ref("password")),
  phone: joi.string(),
  otp: joi.string(),
  id: joi.string().custom(isValidObjectID),
  gender: joi.string().valid(...Object.values(genderTypes)),
  DOB: joi.string(),
  age: joi.number(),
  addresses: joi.object({
    homeAddress: joi.object({
      governorate: joi.string().required(),
      city: joi.string().required(),
      addressDetails: joi.string().required(),
      isDefault: joi.boolean().default(true),
    }),
    workAddress: joi.object({
      governorate: joi.string().required(),
      city: joi.string().required(),
      addressDetails: joi.string().required(),
      isDefault: joi.boolean().default(false),
    }),
  }),
};

export const productGeneralFields = {
  _id: joi.string(),
  productName: joi.string(),
  productDesc: joi.string(),
  price: joi.number(),
  discountPrice: joi.number(),
  stock: joi.number(),
  images: joi.array().items(joi.string()),
  category: joi.string(),
  subCategory: joi.string(),
};

export const categoryGeneralFields = {
  _id: joi.string(),
  name: joi.string().min(3).max(20),
  image: joi.string(),
  isActive: joi.boolean(),
};
export const subCategoryGeneralFields = {
  name: joi.string().min(3).max(20),
  category: joi.string(),
  isActive: joi.boolean(),
};

export const Validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const results = schema.validate(data, { abortEarly: false });
    if (results.error) {
      const errorMessages = results.error.details.map((obj) => obj.message);
      return next(new Error(errorMessages), { cause: 400 });
    }
    return next();
  };
};
