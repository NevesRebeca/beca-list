import { Sequelize, Op } from "sequelize";
import Task from "../models/Task.js";

class TaskController {
  static async getTask(req, res) {
    try {
      const { search } = req.query;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const tasks = await Task.findAndCountAll({
        limit,
        offset,
        where: search
          ? {
              title: {
                [Op.like]: `%${search}%`,
              },
            }
          : {},
        order: [["createdAt", "DESC"]],
      });
      const startingDate = new Date();
      startingDate.setHours(0, 0, 0, 0);

      const endingDate = new Date();
      endingDate.setHours(23, 59, 59, 999);

      const todayCount = await Task.count({
        where: {
          due_date: { [Op.gte]: startingDate, [Op.lte]: endingDate },
        },
      });

      const priorityCount = await Task.count({
        where: {
          priority: { [Op.eq]: "alta" },
        },
      });

      const completedCount = await Task.count({
        where: {
          completed: { [Op.eq]: true },
        },
      });

      res.status(200).json({
        ...tasks,
        counts: {
          today: todayCount,
          priority: priorityCount,
          completed: completedCount,
        },
      });
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

  static async deleteTask(req, res) {
    try {
      const id = req.params.id;
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      } else {
        await task.destroy();
        res.status(200).json({ message: "Tarefa excluída com sucesso" });
      }
    } catch (error) {
      res.status(500).json({
        message: `${error.message} - falha ao excluir tarefa`,
      });
    }
  }
}

export default TaskController;
