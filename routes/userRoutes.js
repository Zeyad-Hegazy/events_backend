import express from "express";
import auth from "../middlewares/auth.js";
const router = express.Router();

import {
	signIn,
	signUp,
	getAllEvents,
	findOrganizer,
	likeEvent,
	subscribeEvent,
	getSubscribedEvents,
	unSubscribeEvent,
} from "../controllers/user.js";

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/", getAllEvents);
router.get("/findorganizer/:organzerId", findOrganizer);
router.get("/getallsubscribed", auth, getSubscribedEvents);
router.patch("/like/:eventId", auth, likeEvent);
router.patch("/subscribe/:eventId", auth, subscribeEvent);
router.patch("/unsubscribe/:eventId", auth, unSubscribeEvent);
export default router;
