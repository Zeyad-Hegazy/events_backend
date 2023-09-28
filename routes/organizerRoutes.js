import express from "express";

const router = express.Router();

import auth from "../middlewares/auth.js";

import { signIn, signUp, createEvent } from "../controllers/organizer.js";

router.post("/signin", signIn);
router.post("/signup", signUp);

router.post("/create", auth, createEvent);

export default router;
