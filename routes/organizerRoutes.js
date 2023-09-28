import express from "express";

const router = express.Router();

import auth from "../middlewares/auth.js";

import {
	signIn,
	signUp,
	createEvent,
	deleteEvent,
	getAllEvents,
} from "../controllers/organizer.js";

router.post("/signin", signIn);

router.post("/signup", signUp);

router.post("/create", auth, createEvent);

router.delete("/delete/:eventId", auth, deleteEvent);

router.get("/getallevents", auth, getAllEvents);

export default router;
