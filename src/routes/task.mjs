import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.mjs";

// auth middleware
import { authMiddleware } from "../middleware/auth.mjs";

const router = Router();

router
  .route("/")
  .post(authMiddleware, createTask)
  .get(authMiddleware, getTasks);
router
  .route("/:id")
  .patch(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

export default router;
