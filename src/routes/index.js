const express = require('express');
const userApiRoutes = require('./api/userApiRoutes');
const postApiRoutes = require('./api/postApiRoutes');
const userFrontendRoutes = require('./frontend/userRoutes');
const postFrontendRoutes = require('./frontend/postRoutes');
const validateSignUp = require('../middleware/validateSignUp');
const userController = require('../controllers/userController');
const upload = require('../config/multer');


const router = express.Router();


router.use('/api/v1/users', userApiRoutes);
router.use('/api/v1/posts', postApiRoutes);


router.get('/signup', userController.renderSignUp);
router.post(
  '/signup',
  upload.single('profilePicture'),
  validateSignUp,
  userController.signUp
);

router.get('/login', userController.renderLogin);
router.post('/login', userController.login);




router.use('/user', userFrontendRoutes);
router.use('/posts', postFrontendRoutes);

module.exports = router;
