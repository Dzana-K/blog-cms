const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = require('./Post')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const PostCategory = require('./PostCategory')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);

// Many-to-Many: Post <-> Category
Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'post_id', as: 'categories' });
Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'category_id', as: 'posts' });

// One-to-Many: Post -> Comments
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

module.exports = { sequelize, Post, Category, PostCategory, Comment };
