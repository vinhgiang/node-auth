const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    return res.send({
      message: 'Your account has been created successfully.',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  store
}