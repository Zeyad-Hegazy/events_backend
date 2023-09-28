import Organizer from "../models/Organizers.js";
import Event from "../models/Events.js";
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
		if (error.message) {
			res.status(500).json({ message: "somthing went wrong !!", error: error });
		}
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
		if (error)
			res.status(500).json({ message: "somthing went wrong !!", error: error });
	}
};

export const createEvent = async (req, res, next) => {
	const userId = req.userId;
	const { title, imageUrl, summary, startsAt, endsAt, place, capacity } =
		req.body;

	try {
		if (!userId) {
			return res
				.status(401)
				.json({ message: "You not allowed to create an event" });
		}

		const organizer = await Organizer.findById({
			_id: new mongoose.Types.ObjectId(userId),
		});

		const createdEvent = await Event.create({
			title,
			imageUrl,
			summary,
			startsAt,
			endsAt,
			place,
			capacity,
			creator: userId,
		});

		await organizer.events.push(createdEvent._id);
		await organizer.save();

		return res
			.status(201)
			.json({ message: "Event Created successfully", event: createdEvent });
	} catch (error) {
		if (error) {
			res.status(500).json({ message: "somthing went wrong !!", error: error });
		}
	}
};
