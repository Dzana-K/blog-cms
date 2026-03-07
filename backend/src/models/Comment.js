module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    postId: { type: DataTypes.INTEGER, allowNull: false, field: 'post_id' },
    authorName: { type: DataTypes.STRING(100), allowNull: false, field: 'author_name' },
    content: { type: DataTypes.TEXT, allowNull: false },
  }, {
    tableName: 'comments',
    underscored: true,
  });

  return Comment;
};
