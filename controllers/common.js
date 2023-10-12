import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Organizer from "../models/Organizers.js";
import User from "../models/Users.js";

export const signIn = async (req, res) => {
	const { email, password } = req.body;

	const existingOrganizer = await Organizer.findOne({ email });
	const existingUser = await User.findOne({ email });

	if (existingOrganizer) {
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

		return res
			.status(200)
			.json({ result: existingOrganizer, type: "organizer", token });
	} else if (existingUser) {
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

		return res.status(200).json({ result: existingUser, type: "user", token });
	}
};
