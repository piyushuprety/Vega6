const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const upload = require('../../config/multer'); // Multer for handling file uploads

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', upload.single('profilePicture'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
