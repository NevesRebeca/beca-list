import express from "express";
import taskController from "../controllers/taskController.js";

const routes = express.Router();

routes.get("/", taskController.getTask);
routes.post("/", taskController.createTask);

export default routes;
