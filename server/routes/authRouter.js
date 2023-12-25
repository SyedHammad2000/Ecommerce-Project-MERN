import {
  Logincontroller,
  registerController,
  testController,
  ForgetPasswordController,
  updateProfileController,
  orderListController,
} from "../controller/authController.js";
import { Signinreq, isAdmin } from "../middleware/signinrequire.js";
// create router

import express from "express";

const router = express.Router();
//register post
router.post("/register", registerController);
// login post
router.post("/login", Logincontroller);
// forget password
router.post("/user-forgetpassword", ForgetPasswordController);

router.get("/test", Signinreq, isAdmin, testController);

// Private Route
router.get("/user-auth", Signinreq, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
// Admin Route
router.get("/admin-auth", Signinreq, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

router.put("/profile", Signinreq, updateProfileController);

// orderlistroute
router.get("/orders",Signinreq,orderListController)

export default router;
