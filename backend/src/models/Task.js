import sequelize from "src/config/database.js";
import { Sequelize, DataTypes, Model } from "sequelize";

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    priority: {
      type: DataTypes.ENUM("baixa", "media", "alta"),
      defaultValue: "media",
    },
    due_date: {
      type: DataTypes.DATE,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelize,
  },
);

export default Task;
