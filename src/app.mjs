import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Allow requests from your frontend
const corsOptions = {
  origin: "*", // Your frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization",
};

// import all the routes
import auth from "./routes/index.mjs";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// routes middleware
app.use("/api", auth);

export default app;
