import express from "express";
import multer from "multer";
import { register, login , ResetPassword , updatePassword } from "../controllers/AuthController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/register", upload.single('photo'), register);
router.post("/login", login);
router.post("/reset-password", ResetPassword);
router.put("/update-password/:userId", updatePassword);

export default router;
