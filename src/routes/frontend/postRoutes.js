const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, postController.renderPosts); 
router.get('/new', authMiddleware, postController.renderPostForm); 
router.get('/:id', authMiddleware, postController.renderPostDetails); 
router.get('/:id/edit', authMiddleware, postController.renderEditPost);
router.get('/:id/delete', authMiddleware, postController.deletePost);

module.exports = router;
