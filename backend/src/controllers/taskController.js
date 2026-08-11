import Sequelize from "sequelize";
import Task from "../models/Task.js";

class TaskController {
  static async getTask(req, res) {
    try {
      const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - falha na requisição` });
    }
  }
}

export default TaskController;
