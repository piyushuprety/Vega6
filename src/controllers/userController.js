const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');

class UserController {
  renderSignUp(req, res) {
    res.render('signup');
  }

  renderLogin(req, res) {
    res.render('login');
  }

  async renderDashboard(req, res) {
    const user = await User.findById(req.user.id);
    const posts = await Post.find().populate('user', 'email');
    console.log('User:', user);
    res.render('dashboard', { user, posts });
  }

  async signUp(req, res) {
    try {
      console.log('Sign-up request body:', req.body);
      const { email, password } = req.body;
      const profilePicture = req.file ? req.file.path : ''; // Save the file path if uploaded
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .render('signup', { error: 'Email already exists' });
      }

      // Create a new user in the database
      const user = new User({
        email,
        password: hashedPassword,
        profilePicture,
      });
      await user.save();

      // Redirect to the login page after successful sign-up
      res.redirect('/login');
    } catch (error) {
      console.error('Error during sign-up:', error.message);
      res
        .status(500)
        .render('signup', { error: 'Something went wrong. Please try again.' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .render('login', { error: 'Email and password are required.' });
      }

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .render('login', { error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '6h' } 
      );

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 6 * 60 * 60 * 1000, 
      });

      res.redirect('/user/dashboard');
    } catch (error) {
      console.error('Error during login:', error.message);
      res
        .status(500)
        .render('login', { error: 'Something went wrong. Please try again.' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error fetching users', details: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error fetching user', details: error.message });
    }
  }


  async updateUser(req, res) {
    try {
      const { name, email, mobile } = req.body;
      const profilePicture = req.file ? req.file.path : ''; 

      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json({ error: 'You are not authorized to update this profile.' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, mobile, ...(profilePicture && { profilePicture }) },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error updating user', details: error.message });
    }
  }


  async deleteUser(req, res) {
    try {
      // Ensure the logged-in user is deleting their own profile
      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json({ error: 'You are not authorized to delete this profile.' });
      }

      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error deleting user', details: error.message });
    }
  }


}

module.exports = new UserController();
