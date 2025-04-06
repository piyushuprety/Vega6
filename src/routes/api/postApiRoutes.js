const express = require('express');
const router = express.Router();
const PostController = require('../../controllers/postController');
const upload = require('../../config/multer');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, PostController.getAllPosts);
router.get('/:id', authMiddleware, PostController.getPostById);

router.post(
  '/new',
  authMiddleware,
  upload.single('image'),
  PostController.createPost
);

router.post(
  '/update/:id',
  authMiddleware,
  upload.single('image'),
  PostController.updatePost
);

router.post(
  '/comment/:postId',
  authMiddleware,
  PostController.addComment
);

router.delete('/:id', authMiddleware, PostController.deletePost);

module.exports = router;
