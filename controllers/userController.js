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

      // sign JWT
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);

      user.refresh_token = refreshToken;
      user.save();

      res.send({
        message: 'You have successfully logged in.',
        token: accessToken,
        refresh_token: refreshToken
      });
    } else {
      res.status(400).send(defaultResponse);
    }
  } catch(err) {
    next(err);
  }
};

const createToken = async (req, res, next) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const isTokenValid = await User.findOne({ refresh_token: refreshToken }).exec();
  if (!isTokenValid) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, jwt_auth) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ id: jwt_auth.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    return res.send({
      'token': accessToken
    })
  })
}

const profile = async (req, res, next) => {
  const userId = req.jwt_auth.id;

  const user = await User.findOne({ _id: userId }).exec();

  res.send(user);
}

module.exports = {
  store,
  login,
  createToken,
  profile
}