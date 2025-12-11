import joi from "joi";
import { subCategoryGeneralFields } from "../../middlewares/validation.middleware.js";
export const addToSubCategoriesSchema = joi
  .object({
    name: subCategoryGeneralFields.name.required(),
    category: subCategoryGeneralFields.category.required(),
    isActive: subCategoryGeneralFields.isActive,
  })
  .required();
export const updateSubCategoriesSchema = joi
  .object({
    _id: joi.string().required(),
    name: subCategoryGeneralFields.name,
    category: subCategoryGeneralFields.category,
    isActive: subCategoryGeneralFields.isActive,
  })
  .required();
