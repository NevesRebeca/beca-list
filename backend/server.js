import "dotenv/config";
import app from "./src/app.js";
import "./src/config/database.js";
import Task from "./src/models/Task.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await Task.sync({ alter: true });
  console.log("Tabela da model Task sincronizada!");

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
};

startServer();
