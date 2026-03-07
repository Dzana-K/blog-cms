module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.STRING(500) },
    author: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Admin' },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    coverImageUrl: { type: DataTypes.STRING(500), field: 'cover_image_url' },
  }, {
    tableName: 'posts',
    underscored: true,
  });

  return Post;
};
