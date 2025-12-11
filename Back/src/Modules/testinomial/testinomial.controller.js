import asyncHandler from "../../../utils/Error Handling/asyncHandler.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import * as testinomialServices from "./testinomial.service.js";

import { Router } from "express";

const router = Router();

router.get(
  "/",
  authentication,
  asyncHandler(testinomialServices.getAllTestimonies)
);

router.post(
  "/",
  authentication,
  allowto(["user"]),
  asyncHandler(testinomialServices.createTestinomial)
);

router.patch(
  "/:id",
  authentication,
  allowto(["admin"]),
  asyncHandler(testinomialServices.updateTestimonie)
);

router.delete(
  "/:id",
  authentication,
  allowto(["admin"]),
  asyncHandler(testinomialServices.removeTestimonie)
);

export default router;
