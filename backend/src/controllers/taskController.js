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

  static async createTask(req, res) {
    try {
      const newTask = await Task.create(req.body);
      res
        .status(201)
        .json({ message: "tarefa cadastrada com sucesso", task: newTask });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - falha ao cadastrar tarefa` });
    }
  }

  static async toggleTaskStatus(req, res) {
    try {
      const id = req.params.id;
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      } else {
        task.completed = !task.completed;
        await task.save();
        res
          .status(200)
          .json({ message: "Status da tarefa atualizado com sucesso", task });
      }
    } catch (error) {
      res.status(500).json({
        message: `${error.message} - falha ao atualizar status da tarefa`,
      });
    }
  }

  static async updateTask(req, res) {
    try {
      const id = req.params.id;
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      } else {
        await task.update(req.body);
        res
          .status(200)
          .json({ message: "Tarefa atualizada com sucesso", task });
      }
    } catch (error) {
      res.status(500).json({
        message: `${error.message} - falha ao atualizar tarefa`,
      });
    }
  }
}

export default TaskController;
