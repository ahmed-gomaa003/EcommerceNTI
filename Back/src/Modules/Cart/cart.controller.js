import { Router } from "express";

import * as cartServices from "./cart.service.js";
import * as cartValidation from "./cart.validation.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";
import { Validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/add",
  authentication,
  allowto(["user"]),
  asyncHandler(cartServices.addToCart)
);

router.get(
  "/",
  authentication,
  allowto(["user"]),
  asyncHandler(cartServices.getUserCart)
);

router.delete(
  "/:_id",
  authentication,
  allowto(["user"]),
  asyncHandler(cartServices.removeFromCart)
);
router.patch(
  "/decreasequantity/:_id",
  authentication,
  allowto(["user"]),
  Validation(cartValidation.increaseAndDecreaseProductQuantityInCart),
  asyncHandler(cartServices.decreaseProductQuantityInCart)
);
router.patch(
  "/increasequantity/:_id",
  authentication,
  allowto(["user"]),
  Validation(cartValidation.increaseAndDecreaseProductQuantityInCart),
  asyncHandler(cartServices.increaseProductQuantityInCart)
);
export default router;
