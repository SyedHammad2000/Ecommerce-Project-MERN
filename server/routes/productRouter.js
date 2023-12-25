import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  getAllProducts,
  getPhotoProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  getFilterproduct,
  getSimiliarProduct,
  // StripePay,
  CheckoutPayment,
  // verifytokenpaymentcontroller,
  // paymenttokencontroller,
} from "../controller/productController.js";
import { Signinreq, isAdmin } from "../middleware/signinrequire.js";

const router = express.Router();

// Create Product Routing
router.post(
  "/create-product",
  Signinreq,
  isAdmin,
  formidable(),
  createProductController
);

// get All Products;
router.get("/all-products", getAllProducts);

// Get Single Product
router.get("/get-singleproduct/:slug", getSingleProduct);

// get product photo;
router.get("/product-photo/:pid", getPhotoProduct);
// Delete Product
router.delete("/product-delete/:id", deleteProduct);

// Update Product
router.put(
  "/product-update/:id",
  Signinreq,
  isAdmin,
  formidable(),
  updateProduct
);

// filter product
router.post("/filter-product", getFilterproduct);

// Similar-related-product
router.get("/related-product/:pid/:cid", getSimiliarProduct);

// payment gateway api
// router.get("/braintree/token", paymenttokencontroller);

router.post("/checkout", Signinreq, CheckoutPayment);

export default router;
