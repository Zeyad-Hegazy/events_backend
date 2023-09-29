import Organizer from "../models/Organizers.js";
import Event from "../models/Events.js";
import Users from "../models/Users.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signIn = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const existingOrganizer = await Organizer.findOne({ email });

		if (!existingOrganizer)
			return res.status(404).json({ message: "Organizer not found!" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingOrganizer.password
		);

		if (!isPasswordCorrect)
			return res.status(400).json({ message: "Invalid Password" });

		const token = jwt.sign(
			{
				email: existingOrganizer.email,
				id: existingOrganizer._id,
			},
			"SECRET_TEXT"
		);

		res.status(200).json({ result: existingOrganizer, token });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const signUp = async (req, res, next) => {
	const { name, business, email, password, confirmpassword } = req.body;

	try {
		const existingOrganizer = await Organizer.findOne({ email: email });

		if (existingOrganizer) {
			console.log(existingOrganizer);
			return res.status(400).json({ message: "this email already exist" });
		}

		if (password !== confirmpassword) {
			return res.status(400).json({ message: "Passwords dont match" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await Organizer.create({
			name,
			business,
			email,
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ email: result.email, id: result._id },
			"SECRET_TEXT"
		);

		res.status(200).json({ result: result, token: token });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const createEvent = async (req, res, next) => {
	const userId = req.userId;
	const { title, imageUrl, summary, startsAt, endsAt, place, price, capacity } =
		req.body;

	try {
		if (!userId)
			return res
				.status(401)
				.json({ message: "You are not allowed to do that" });

		const organizer = await Organizer.findById(userId);

		const createdEvent = await Event.create({
			title,
			imageUrl,
			summary,
			startsAt,
			endsAt,
			place,
			price,
			capacity,
			creator: userId,
		});

		await organizer.events.push(createdEvent._id);
		await organizer.save();

		return res
			.status(201)
			.json({ message: "Event Created successfully", event: createdEvent });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const deleteEvent = async (req, res, next) => {
	const eventId = req.params.eventId;
	const userId = req.userId;

	try {
		if (!userId)
			return res
				.status(401)
				.json({ message: "You are not allowed to do that" });

		await Event.findByIdAndRemove(eventId);

		const organizer = await Organizer.findById(userId);

		await organizer.events.pull(eventId);
		await organizer.save();

		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const getAllEvents = async (req, res, next) => {
	const userId = req.userId;

	try {
		if (!userId)
			return res
				.status(401)
				.json({ message: "You are not allowed to do that" });

		const organizer = await Organizer.findById(userId);

		const allEventsIds = organizer.events;

		const allEventObjs = await Event.find({ _id: { $in: allEventsIds } });

		return res
			.status(200)
			.json({ message: "Here all events", result: allEventObjs });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const getAllEventSubs = async (req, res, next) => {
	const userId = req.userId;
	const eventId = req.params.eventId;

	try {
		if (!userId)
			return res
				.status(401)
				.json({ message: "You are not allowed to do that" });

		const organizer = await Organizer.findById(userId);

		const event = organizer.events.find((event) => event === eventId);

		const eventObj = await Event.findById(event);

		const allSubsIds = eventObj.subscribers;

		const allSubsObjs = await Users.find({ _id: { $in: allSubsIds } });

		res
			.status(200)
			.json({ message: "here all subscibers objects", result: allSubsObjs });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const editEvent = async (req, res, next) => {
	const userId = req.userId;
	const eventId = req.params.eventId;

	const { title, imageUrl, summary, endsAt, price } = req.body;

	try {
		if (!userId)
			return res
				.status(401)
				.json({ message: "You are not allowed to do that" });

		const organizer = await Organizer.findById(userId);

		const event = organizer.events.find((event) => event === eventId);

		const updatedEvent = await Event.findByIdAndUpdate(
			event,
			{
				title,
				imageUrl,
				summary,
				endsAt,
				price,
			},
			{ new: true }
		);

		res
			.status(200)
			.json({ message: "Event updated successfully", result: updatedEvent });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};
