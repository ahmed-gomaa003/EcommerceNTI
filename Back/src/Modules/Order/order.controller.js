import { Router } from "express";
import * as orderServices from "./order.service.js";
import * as orderValidation from "./order.validation.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";

const router = Router();

router.get(
  "/",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.getAllOrders)
);
router.get(
  "/trackingNumber/:trackingNumber",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.getOrderBytrackingNumber)
);

router.get(
  "/user",
  authentication,
  allowto(["user"]),
  asyncHandler(orderServices.getAllUserOrders)
);

router.post("/", authentication, asyncHandler(orderServices.createOrder));

router.delete(
  "/cancel/:trackingNumber",
  authentication,
  allowto(["user"]),
  asyncHandler(orderServices.userCancelOrder)
);
router.patch(
  "/canceladmin/:trackingNumber",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.adminCancelOrder)
);
router.patch(
  "/preparing/:trackingNumber",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.orderPreparing)
);
router.patch(
  "/shipped/:trackingNumber",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.orderShipped)
);
router.patch(
  "/delivered/:trackingNumber",
  authentication,
  allowto(["admin"]),
  asyncHandler(orderServices.orderDelivered)
);
export default router;
