module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {
    postId: { type: DataTypes.INTEGER, field: 'post_id', primaryKey: true },
    categoryId: { type: DataTypes.INTEGER, field: 'category_id', primaryKey: true },
  }, {
    tableName: 'post_categories',
    underscored: true,
    timestamps: false,
  });

  return PostCategory;
};
