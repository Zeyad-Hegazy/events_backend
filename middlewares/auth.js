import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];

		console.log(token);

		const decodeData = jwt.verify(token, "SECRET_TEXT");
		req.userId = decodeData?.id;

		next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;
