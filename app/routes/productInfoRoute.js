import { Router } from "express";
import {
  addProductsToBackend,
  createProductInfo,
  deleteProductInfo,
  editProductInfo,
  getLastFiveOutOfStockProducts,
  // insertProduct,
  getProductInfo,
  getProductsInfo
} from "../controllers/productIndoController.js";
const ProductInfoRoute = Router();

ProductInfoRoute.get("/:id", getProductInfo);
ProductInfoRoute.get("/", getProductsInfo);
// ProductInfoRoute.post("/insert", insertProduct);
ProductInfoRoute.get("/last", getLastFiveOutOfStockProducts);
ProductInfoRoute.post("/", createProductInfo);
ProductInfoRoute.post("/many", addProductsToBackend);
ProductInfoRoute.put("/:id", editProductInfo);
ProductInfoRoute.delete("/:id", deleteProductInfo);
export default ProductInfoRoute;
