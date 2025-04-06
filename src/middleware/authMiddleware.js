const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('auth', req.cookies)
  const token = req.cookies.token; 

  if (!token) {
    return res.redirect('/login'); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    console.log('Decoded user:', req.user);
    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    res.redirect('/login');
  }
};

module.exports = authMiddleware;
