const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const store = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (user) {
    return res.status(422).send({
      error: 'This email address has been taken.',
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    ...req.body,
    password: hashedPassword
  });

  try {
    await newUser.save();
    return res.status(201).send({
      message: 'Your account has been created successfully.',
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  const defaultResponse = {
    error: 'Your email or password is not match.'
  };
  const { password, email } = req.body;

  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return res.status(400).send(defaultResponse);
  }

  try {
    if (await bcrypt.compare(password, user.password)) {

      // convert User Model from Mongoose Document to plain object
      const safeUser = user.toObject();
      delete safeUser.password;

      // sign JWT
      const accessToken = jwt.sign(safeUser, process.env.ACCESS_TOKEN_SECRET);

      res.send({
        message: 'You have successfully logged in.',
        token: accessToken
      });
    } else {
      res.status(400).send(defaultResponse);
    }
  } catch(err) {
    next(err);
  }
};

const profile = (req, res, next) => {
  // simply just send user info decoded from JWT from authenticate middleware
  res.send(req.user);
}

module.exports = {
  store,
  login,
  profile
}