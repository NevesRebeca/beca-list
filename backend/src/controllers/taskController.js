import { Op } from "sequelize";
import Task from "../models/Task.js";
import { getTodayRange } from "../utils/dateRange.js";

class TaskController {
  static async getTask(req, res) {
    try {
      const { search, status, priority, due } = req.query;

      // paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit; // registro pulados

      // obj where
      const where = {};

      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }

      // filtros tarefas completas
      if (status === "completed") {
        where.completed = true;
      }

      // filtro prioridade alta
      if (priority) {
        where.priority = priority;
      }

      // filtro tarefas de hoje
      if (due === "today") {
        const { startingDate, endingDate } = getTodayRange();
        where.due_date = { [Op.gte]: startingDate, [Op.lte]: endingDate };
      }

      const tasks = await Task.findAndCountAll({
        limit,
        offset,
        where,
        order: [["createdAt", "DESC"]],
      });

      // contadores

      const { startingDate, endingDate } = getTodayRange();

      // contador de tarefas com data de vencimento para hoje
      const todayCount = await Task.count({
        where: {
          due_date: { [Op.gte]: startingDate, [Op.lte]: endingDate },
        },
      });

      //contador de tarefas com prioridade alta
      const priorityCount = await Task.count({
        where: {
          priority: { [Op.eq]: "alta" },
        },
      });

      //contador de tarefas concluídas
      const completedCount = await Task.count({
        where: {
          completed: { [Op.eq]: true },
        },
      });

      // contador de tarefas não concluídas
      const uncompletedCount = await Task.count({
        where: {
          completed: { [Op.eq]: false },
        },
      });

      const overdueCount = await Task.count({
        where: {
          due_date: { [Op.lt]: startingDate },
          completed: false,
        },
      });

      //contagem total de tarefas
      const totalCount = await Task.count();

      // passando pro front
      res.status(200).json({
        ...tasks,
        counts: {
          today: todayCount,
          priority: priorityCount,
          completed: completedCount,
          uncompleted: uncompletedCount,
          overdue: overdueCount,
          total: totalCount,
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
