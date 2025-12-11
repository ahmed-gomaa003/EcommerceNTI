import joi from "joi";
import { productGeneralFields } from "../../middlewares/validation.middleware.js";

export const addProductSchema = joi
  .object({
    productName: productGeneralFields.productName.required(),
    productDesc: productGeneralFields.productDesc.required(),
    price: productGeneralFields.price.required(),
    discountPrice: productGeneralFields.discountPrice,
    stock: productGeneralFields.stock.required(),
    images: productGeneralFields.images,
    category: productGeneralFields.category.required(),
    subCategory: productGeneralFields.subCategory.required(),
  })
  .required();

export const updateProductData = joi.object({
  _id: productGeneralFields._id.required(),
  productName: productGeneralFields.productName,
  productDesc: productGeneralFields.productDesc,
  price: productGeneralFields.price,
  discountPrice: productGeneralFields.discountPrice,
  stock: productGeneralFields.stock,
  images: productGeneralFields.images,
  category: productGeneralFields.category,
  subCategory: productGeneralFields.subCategory,
});

export const getAllProductsByCaterorySchema = joi.object({
  _id: joi.string().required(),
});
