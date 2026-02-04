import express from "express";
import {
  getComplaints,
  createComplaint,
  resolveComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getComplaints);
router.post("/", createComplaint);
router.put("/:id/resolve", authMiddleware, resolveComplaint);
router.delete("/:id", authMiddleware, deleteComplaint);

export default router;
