import globalErrorHandler from "../utils/Error Handling/globalErrorHandler.js";
import notFoundHandler from "../utils/Error Handling/notFoundHandler.js";
import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import productRouter from "./Modules/product/product.controller.js";
import cartRouter from "./Modules/Cart/cart.controller.js";
import categoryRouter from "./Modules/category/category.controller.js";
import subCategoryRouter from "./Modules/subCategory/subcategory.controller.js";
import orderRouter from "./Modules/Order/order.controller.js";
import salesReport from "./Modules/Reports/sales-report.controller.js";
import testinomial from "./Modules/testinomial/testinomial.controller.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
const bootstrap = async (app, express) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  await connectDB();
  app.use(cors());
  app.use(express.json());
  app.use(
    "/uploads/category",
    express.static(path.join(__dirname, "../uploads/category"))
  );

  app.use(
    "/uploads/images",
    express.static(path.join(__dirname, "../uploads/images"))
  );

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/category", categoryRouter);
  app.use("/subcategory", subCategoryRouter);
  app.use("/order", orderRouter);
  app.use("/report", salesReport);
  app.use("/testinomial", testinomial);

  app.all(/.*/, notFoundHandler);
  app.use(globalErrorHandler);
};
export default bootstrap;
