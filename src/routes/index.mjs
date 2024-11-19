import { Router } from "express";

const router = Router();

// routes
import auth from "./auth.mjs";
import task from "./task.mjs";
import user from "./user.mjs";

router.use("/auth", auth);
router.use("/task", task);
router.use("/user", user);

export default router;
