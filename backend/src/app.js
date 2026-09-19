import express from "express";
import cors from "cors";
import routes from "./routes/taskRoutes.js";

const app = express(); // cria o servidor express

app.use(cors()); // habilita o CORS para permitir requisições de diferentes origens
app.use(express.json()); // express entende o body em json

// teste
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", routes);

export default app;
