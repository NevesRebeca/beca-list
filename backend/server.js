import "dotenv/config";
import app from "./src/app.js";
import "./src/config/database.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
