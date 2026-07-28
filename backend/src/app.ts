import express from "express";
import cors from "cors";
import tripRoutes from "./routes/tripRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/trips", tripRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
