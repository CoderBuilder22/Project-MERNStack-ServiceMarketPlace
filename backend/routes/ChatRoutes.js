import express from "express";
import { getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId/:otherUserId", getChatHistory);

export default router;
