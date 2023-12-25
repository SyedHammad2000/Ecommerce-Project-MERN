import express from "express";
import { Signinreq, isAdmin } from "../middleware/signinrequire.js";
import {
  createCategoryController,
  UpdateCategoryController,
  getAllCategorycontroller,
  getSinglecategorycontroller,
  deleteCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();
// category-route

router.post("/create-category", Signinreq, isAdmin, createCategoryController);
router.put(
  "/update-category/:id",
  Signinreq,
  isAdmin,
  UpdateCategoryController
);
router.get("/get-allcategory", getAllCategorycontroller);

router.get("/get-singlecategory/:slug", getSinglecategorycontroller);
router.delete(
  "/delete-category/:id",
  Signinreq,
  isAdmin,
  deleteCategoryController
);

export default router;
