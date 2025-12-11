import { getSalesReport } from "./sales-report.service.js";
import { allowto, authentication } from "../../middlewares/auth.middleware.js";
import { Router } from "express";
const router = Router();

router.get("/", authentication, allowto(["admin"]), getSalesReport);

export default router;
