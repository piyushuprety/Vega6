const validateSignUp = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .render('signup', { error: 'Email and password are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).render('signup', { error: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .render('signup', {
        error: 'Password must be at least 6 characters long.',
      });
  }

  next();
};

module.exports = validateSignUp;
