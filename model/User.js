const Sequelize = require("sequelize");
const db = require("../model/db");
const Post = require('./Post');

const User = db.define(
  "User",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.DataTypes.STRING(64),
      allowNull: false
      // validate: {
      //   is: /^[0-9a-f]{64}$/i
      // }
    },
    roles: {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      defaultValue: ["User"],
      allowNull: false
    },
    active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true
    },
    refreshToken: {
      type: Sequelize.DataTypes.STRING,
      // validate: {
      //   is: /^[0-9a-f]{64}$/i
      // }
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Post, {
  foreignKey: 'userId',
  sourceKey: 'id'
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  targetId: 'id'
});

module.exports = User;