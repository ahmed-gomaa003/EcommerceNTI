import { Router } from "express";
import * as categoryService from "./category.service.js";
import * as categoryValidation from "./category.validation.js";
import { Validation } from "../../middlewares/validation.middleware.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";
import {
  fileValidation,
  upload,
} from "../../../utils/file Uploading/multerUpload.js";

const router = Router();

router.get("/", categoryService.getAllCaterories);
router.get("/:_id", asyncHandler(categoryService.getCategoryById));
router.get("/slug/:slug", asyncHandler(categoryService.getCategoryBySlug));
router.post(
  "/",
  authentication,
  allowto(["admin"]),
  upload(fileValidation.images, "uploads/category").single("image"),
  Validation(categoryValidation.addAndUpdateCategorySchema),
  asyncHandler(categoryService.addCategory)
);

router.delete(
  "/:_id",
  authentication,
  allowto(["admin"]),
  asyncHandler(categoryService.removeCategoryById)
);

router.patch(
  "/:_id",
  authentication,
  allowto(["admin"]),
  upload(fileValidation.images, "uploads/category").single("image"),
  Validation(categoryValidation.addAndUpdateCategorySchema),
  asyncHandler(categoryService.updateCategoryById)
);

export default router;
