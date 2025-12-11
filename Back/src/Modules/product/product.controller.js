import { Router } from "express";
import * as productServices from "./product.service.js";
import * as productValidation from "./product.validation.js";
import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import { Validation } from "../../middlewares/validation.middleware.js";
import {
  fileValidation,
  upload,
} from "../../../utils/file Uploading/multerUpload.js";
import { pagination } from "../../middlewares/pagination.middleware.js";
import ProductModel from "../../DB/Models/product.model.js";

const router = Router();

router.get(
  "/",
  pagination(ProductModel, "category subCategory"),
  asyncHandler(productServices.getAllproducts)
);

router.get(
  "/allproducts",
  authentication,
  allowto(["admin"]),
  asyncHandler(productServices.adminGetAllproducts)
);

router.get(
  "/bycategory/:_id",
  Validation(productValidation.getAllProductsByCaterorySchema),
  asyncHandler(productServices.getAllProductsByCaterory)
);

router.get("/slug/:slug", asyncHandler(productServices.getProductBySlug));

router.get("/:_id", asyncHandler(productServices.getProductById));

router.post(
  "/add",
  authentication,
  allowto(["admin"]),
  upload(fileValidation.images, "uploads/images").array("images", 10),
  Validation(productValidation.addProductSchema),
  asyncHandler(productServices.addProduct)
);

router.put(
  "/update/:_id",
  authentication,
  allowto(["admin"]),
  Validation(productValidation.updateProductData),
  upload(fileValidation.images, "uploads/images").array("images", 10),
  asyncHandler(productServices.updateProductData)
);

router.delete(
  "/delete/:id",
  authentication,
  allowto(["admin"]),
  asyncHandler(productServices.deleteProductById)
);

export default router;
