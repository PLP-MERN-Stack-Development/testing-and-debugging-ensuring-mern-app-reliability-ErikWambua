const express = require('express');
const Post = require('../models/Post');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const post = new Post({
      title,
      content,
      category,
      author: req.user.userId,
    });

    await post.save();
    await post.populate('author', 'username email');

    res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;

    await post.save();
    await post.populate('author', 'username email');

    res.json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;