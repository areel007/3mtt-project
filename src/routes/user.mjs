import { Router } from "express";
import { getUser } from "../controllers/user.mjs";

const router = Router();

router.route("/:id").get(getUser);

export default router;
