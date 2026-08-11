import express from "express";
import cors from "cors";
import routes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", routes);

export default app;
