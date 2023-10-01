import User from "../models/Users.js";
import Event from "../models/Events.js";
import Organizer from "../models/Organizers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signIn = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (!existingUser)
			return res.status(404).json({ message: "User not found!" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!isPasswordCorrect)
			return res.status(400).json({ message: "Invalid Password" });

		const token = jwt.sign(
			{
				email: existingUser.email,
				id: existingUser._id,
			},
			"SECRET_TEXT"
		);

		return res.status(200).json({ result: existingUser, token });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const signUp = async (req, res) => {
	const {
		email,
		password,
		firstName,
		LastName,
		age,
		city,
		gender,
		imageUrl,
		phoneNumber,
		confirmpassword,
	} = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser)
			return res.status(400).json({ message: "this email already exist" });

		if (password !== confirmpassword)
			return res.status(400).json({ message: "Passwords dont match" });

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await User.create({
			fullName: `${firstName} ${LastName}`,
			age,
			city,
			gender,
			imageUrl,
			email,
			password: hashedPassword,
			phoneNumber,
		});

		const token = jwt.sign(
			{ email: result.email, id: result._id },
			"SECRET_TEXT"
		);

		return res.status(200).json({ result, token });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const getAllEvents = async (req, res, next) => {
	try {
		const allEvents = await Event.find({});
		res.status(200).json({ message: "here all events", result: allEvents });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const findOrganizer = async (req, res, next) => {
	const organizerId = req.params.organzerId;

	try {
		const organizer = await Organizer.findById(organizerId);

		const eventsrow = await Event.find({
			_id: { $in: organizer.events },
		}).select(["-_id", "-likes", "-subscribers", "-__v", "-creator"]);

		const resultOrganizer = {
			name: organizer.name,
			business: organizer.business,
			events: eventsrow,
			email: organizer.email,
		};

		res
			.status(200)
			.json({ message: "here the organizer", result: resultOrganizer });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const likeEvent = async (req, res, next) => {
	const userId = req.userId;
	const eventId = req.params.eventId;

	try {
		if (!userId)
			return res
				.status(400)
				.json({ message: "You are not allowed to do that" });
		const event = await Event.findById(eventId);
		event.likes.push(userId);
		await event.save();
		res.status(200).json({ message: "user liked event" });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const subscribeEvent = async (req, res, next) => {
	const userId = req.userId;
	const eventId = req.params.eventId;

	try {
		if (!userId)
			return res
				.status(400)
				.json({ message: "You are not allowed to do that" });

		const event = await Event.findById(eventId);
		event.subscribers.push(userId);
		await event.save();

		const user = await User.findById(userId);
		user.subscripeAt.push(eventId);
		await user.save();

		res.status(200).json({ message: "user subscribe to that event" });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const getSubscribedEvents = async (req, res, next) => {
	const userId = req.userId;

	try {
		if (!userId)
			return res
				.status(400)
				.json({ message: "You are not allowed to do thaar" });

		const user = await User.findById(userId);
		const allSubscribedEvents = await Event.find({
			_id: { $in: user.subscripeAt },
		}).select(["-_id", "-creator", "-likes", "-subscribers", "-__v"]);

		res.status(200).json({
			message: "here all subscribed events",
			result: allSubscribedEvents,
		});
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};

export const unSubscribeEvent = async (req, res, next) => {
	const userId = req.userId;
	const eventId = req.params.eventId;

	try {
		if (!userId)
			return res
				.status(400)
				.json({ message: "You are not allowed to do thaar" });

		const event = await Event.findById(eventId);
		event.subscribers.pull(userId);
		await event.save();

		const user = await User.findById(userId);
		user.subscripeAt.pull(eventId);
		await user.save();

		res.status(200).json({ message: "user unsubscribed to that event" });
	} catch (error) {
		res.status(500).json({ message: "somthing went wrong !!", error });
	}
};
