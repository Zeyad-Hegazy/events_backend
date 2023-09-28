import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import orgaizerRoutes from "./routes/organizerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const connection_url = process.env.CONNENCTION_URL;
const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/organize", orgaizerRoutes);
app.use("/user", userRoutes);
app.use("/event", eventRoutes);

// app.use((error, req, res, next) => {
// 	return res
// 		.status(error.status)
// 		.json({ message: "somthing went wrong !!", error: error.message });
// });
mongoose
	.connect(connection_url)
	.then(() => {
		app.listen(PORT);
		console.log(`server running on port : ${PORT}`);
	})
	.catch((err) => {
		console.log(err);
	});
