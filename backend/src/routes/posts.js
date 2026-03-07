const router = require('express').Router();
const { Post, Category, Comment, PostCategory } = require('../models');
const slugify = require('../utils/slugify');

// GET /api/posts — published posts (public)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = { published: true };
    const include = [{ association: 'categories' }];

    if (req.query.category) {
      include[0].where = { slug: req.query.category };
      include[0].required = true;
    }

    const { rows, count } = await Post.findAndCountAll({
      where,
      include,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    res.json({
      posts: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/all — all posts including drafts (admin)
router.get('/all', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { rows, count } = await Post.findAndCountAll({
      include: [{ association: 'categories' }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    res.json({
      posts: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      include: [
        { association: 'categories' },
        { association: 'comments', order: [['created_at', 'DESC']] },
      ],
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts
router.post('/', async (req, res, next) => {
  try {
    const { title, content, excerpt, author, published, coverImageUrl, categoryIds } = req.body;
    const slug = slugify(title);

    const post = await Post.create({
      title, slug, content, excerpt, author, published, coverImageUrl,
    });

    if (categoryIds && categoryIds.length > 0) {
      await post.setCategories(categoryIds);
    }

    const result = await Post.findByPk(post.id, { include: [{ association: 'categories' }] });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { title, content, excerpt, author, published, coverImageUrl, categoryIds } = req.body;

    if (title && title !== post.title) {
      post.slug = slugify(title);
    }

    Object.assign(post, {
      title: title ?? post.title,
      content: content ?? post.content,
      excerpt: excerpt ?? post.excerpt,
      author: author ?? post.author,
      published: published ?? post.published,
      coverImageUrl: coverImageUrl ?? post.coverImageUrl,
    });

    await post.save();

    if (categoryIds !== undefined) {
      await post.setCategories(categoryIds);
    }

    const result = await Post.findByPk(post.id, { include: [{ association: 'categories' }] });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
