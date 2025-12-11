import { Router } from "express";
import * as subCategoryService from "./subcategory.service.js";
import * as subCategoryValidation from "./subcategory.validation.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import { Validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.get("/", subCategoryService.getAllSubcategories);
router.post(
  "/",
  authentication,
  allowto(["admin"]),
  Validation(subCategoryValidation.addToSubCategoriesSchema),
  subCategoryService.addSubcategory
);

router.delete(
  "/:_id",
  authentication,
  allowto(["admin"]),
  subCategoryService.removeSubCategoryById
);
router.patch(
  "/:_id",
  authentication,
  allowto(["admin"]),
  Validation(subCategoryValidation.updateSubCategoriesSchema),
  subCategoryService.updateSubCategoryById
);
export default router;
