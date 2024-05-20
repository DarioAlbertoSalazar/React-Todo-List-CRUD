const sequelize = require("./sequelize_conn.js");
const { DataTypes, Model } = require("sequelize");

class Task extends Model {}

Task.init(
  {
    title: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "Task",
  }
);

module.exports = Task;
