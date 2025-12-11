import { Router } from "express";
import * as userServices from "./user.service.js";
import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import { Validation } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { roleTypes } from "../../DB/Models/user.model.js";
const router = Router();

router.get(
  "/",
  authentication,
  allowto([roleTypes.user, roleTypes.admin]),
  asyncHandler(userServices.getUserdata)
);
router.put(
  "/updateprofile",
  authentication,
  Validation(userValidation.updateUserSchema),
  asyncHandler(userServices.updateUserdata)
);

router.patch(
  "/changepassword",
  Validation(userValidation.changePasswordSchema),
  authentication,
  userServices.changePassword
);

export default router;
