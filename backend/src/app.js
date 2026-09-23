import express from "express";
import cors from "cors";
import routes from "./routes/taskRoutes.js";

const app = express(); // cria o servidor express

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "https://beca-list.vercel.app",
];

app.use(cors({ origin: allowedOrigins })); // habilita o CORS para permitir requisições das origens que foram liberadas
app.use(express.json()); // express entende o body em json

// teste
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", routes);

export default app;
