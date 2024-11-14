import { Router } from "express";

const router = Router();

// routes
import auth from "./auth.mjs";
import task from "./task.mjs";

router.use("/auth", auth);
router.use("/task", task);

export default router;
