const Post = require('../models/Post');

class PostController {

  async renderPosts(req, res) {
    const posts = await Post.find().populate('user', 'email');
    res.render('posts', { posts, user: req.user });
  }

  renderPostForm(req, res) {
    res.render('postForm');
  }

  async renderPostDetails(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate('user', 'email') 
        .populate({
          path: 'comments',
          populate: { path: 'user', select: 'email' },
        });

      if (!post) {
        return res.status(404).send('Post not found');
      }
      const user = req.user;
      console.log('Post:', user);

      res.render('postDetails', { post, user });
    } catch (error) {
      console.error('Error fetching post details:', error.message);
      res.status(500).send('Error loading post details');
    }
  }

  async renderEditPost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send('Post not found');
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).send('Unauthorized');
      }

      res.render('editPost', { post });
    } catch (error) {
      console.error('Error rendering edit post page:', error.message);
      res.status(500).send('Error loading edit post page');
    }
  }

  async createPost(req, res) {
    try {
      const { title, description } = req.body;
      const picture = req.file ? req.file.path : '';
      const post = new Post({ title, description, picture, user: req.user.id });
      await post.save();
      res.redirect('/user/dashboard');
    } catch (error) {
      res.status(500).send('Error creating post');
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate('user', 'name email') 
        .populate('comments.user', 'name email');
      res.json(posts);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error fetching posts', details: error.message });
    }
  }

  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate('user', 'name email')
        .populate('comments.user', 'name email');
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error fetching post', details: error.message });
    }
  }

  async updatePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send('Post not found');
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).send('Unauthorized');
      }

      post.title = req.body.title;
      post.description = req.body.description;

      if (req.file) {
        post.picture = req.file.path;
      }

      await post.save();
      console.log('Post updated:', post);
      res.redirect(`/posts/${post._id}`);
    } catch (error) {
      console.error('Error updating post:', error.message);
      res.status(500).send('Error updating post');
    }
  }

  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send('Post not found');
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).send('Unauthorized');
      }

      await post.deleteOne({ _id: req.params.id });
      res.redirect('/user/dashboard');
    } catch (error) {
      console.error('Error deleting post:', error.message);
      res.status(500).send('Error deleting post');
    }
  }
  async addComment(req, res) {
    try {
      const postId = req.params.postId;
      const text = req.body.text;
      const user = req.user.id;
      if (!postId || !user || !text) {
        return res
          .status(400)
          .json({ error: 'Post ID, user, and text are required' });
      }
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      post.comments.push({ user, text });
      await post.save();
      res.redirect(`/posts/${postId}`);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error adding comment', details: error.message });
    }
  }
}

module.exports = new PostController();
