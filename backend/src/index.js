const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', commentRoutes);
app.use('/api', healthRoutes);

app.use(errorHandler);

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});
