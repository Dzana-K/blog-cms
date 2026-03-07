const router = require('express').Router();
const { Comment, Post } = require('../models');

// GET /api/posts/:postId/comments
router.get('/posts/:postId/comments', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [['created_at', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:postId/comments
router.post('/posts/:postId/comments', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { authorName, content } = req.body;
    const comment = await Comment.create({
      postId: req.params.postId,
      authorName,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:id
router.delete('/comments/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
