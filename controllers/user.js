import User from "../models/Users.js";
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
		res.status(500).json({ message: "somthing went wrong !!", error: error });
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
		res.status(500).json({ message: "somthing went wrong !!", error: error });
	}
};
