import api from "./api.js";

const ui = {
  async testConnection() {
    const result = await api.test();
    document.getElementById("status").textContent = result.status;
  },
};
export default ui;
