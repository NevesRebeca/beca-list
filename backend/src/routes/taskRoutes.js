import express from "express";
import taskController from "../controllers/taskController.js";

const routes = express.Router();

routes.get("/", taskController.getTask);

export default routes;
