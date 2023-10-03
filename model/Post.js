const Sequelize = require("sequelize");
const db = require("../model/db");

const Post = db.define(
  "Post",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
    },
    body: {
      type: Sequelize.DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Post;