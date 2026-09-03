const api = {
  async test() {
    // caso algum erro na requisição, o try catch vai capturar e exibir no console
    try {
      const response = await fetch(`http://localhost:3000/ping`);
      return await response.json(); // fazer a conversão do formato json para o objeto JS
    } catch (error) {
      alert("Erro no teste");
      throw error;
    }
  },

  async fetchTasks(search = "", page = 1, limit = 5) {
    try {
      const url = `http://localhost:3000/tasks?search=${search}&page=${page}&limit=${limit}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      alert("Erro ao buscar tarefas");
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const response = await fetch(`http://localhost:3000/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      return await response.json();
    } catch (error) {
      alert("Erro ao criar tarefa");
      throw error;
    }
  },

  async toggleTaskStatus(id) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}/toggle`, {
        method: "PUT",
      });
      return await response.json();
    } catch (error) {
      alert("Erro ao atualizar status da tarefa");
      throw error;
    }
  },

  async updateTask(id, taskData) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(taskData),
      });
    } catch (error) {
      alert("Erro ao atualizar tarefa");
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      alert("Erro ao deletar tarefa");
      throw error;
    }
  },
};

export default api;
