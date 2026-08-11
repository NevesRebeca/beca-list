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

  async fetchTasks() {
    try {
      const response = await fetch(`http://localhost:3000/tasks`);
      return await response.json();
    } catch (error) {
      alert("Erro ao buscar tarefas");
      throw error;
    }
  },
};

export default api;
