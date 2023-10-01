import express from "express";

const router = express.Router();

import auth from "../middlewares/auth.js";

import {
	signIn,
	signUp,
	createEvent,
	editEvent,
	deleteEvent,
	getAllEvents,
	getAllEventSubs,
	getAllEventLikes,
} from "../controllers/organizer.js";

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/create", auth, createEvent);
router.patch("/edit/:eventId", auth, editEvent);
router.delete("/delete/:eventId", auth, deleteEvent);
router.get("/getallevents", auth, getAllEvents);
router.get("/getalleventsubs/:eventId", auth, getAllEventSubs);
router.get("/getalleventlikes/:eventId", auth, getAllEventLikes);

export default router;
