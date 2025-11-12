import express from "express";
import { register, login , ResetPassword , updatePassword } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", ResetPassword);
router.put("/update-password/:userId", updatePassword);

export default router;
