import joi from "joi";
import { categoryGeneralFields } from "../../middlewares/validation.middleware.js";

export const addAndUpdateCategorySchema = joi.object({
  _id: categoryGeneralFields._id,
  name: categoryGeneralFields.name,
  image: categoryGeneralFields.image,
  isActive: categoryGeneralFields.isActive,
});
