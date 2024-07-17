// @ts-nocheck
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication failed. Token not provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: 'Authentication failed.' });
  }
};

module.exports = authenticateUser;

