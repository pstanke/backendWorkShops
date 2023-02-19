const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');

exports.register = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { login, password, avatar, phone } = sanitizedBody;
    if (
      login &&
      typeof login === 'string' &&
      password &&
      typeof password === 'string' &&
      avatar &&
      typeof avatar === 'string' &&
      phone &&
      typeof phone === 'string'
    ) {
      const userWithLogin = await User.findOne({ login });
      if (userWithLogin) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const user = await User.create({
        login,
        password: await bcrypt.hash(password, 10),
        avatar,
        phone,
      });
      res.status(201).send({ message: user.login + '  created successfully' });
    } else {
      res.status(400).json({ message: 'Bad request' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { login, password } = sanitizedBody;
    if (
      login &&
      typeof login === 'string' &&
      password &&
      typeof password === 'string'
    ) {
      const user = await User.findOne({ login });
      if (!user) {
        res.status(400).json({ message: 'Login or password are incorrect' });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user = {
            id: user._id,
            login: user.login,
          };
          res
            .status(200)
            .send({ message: user.login + ' logged in successfully' });
        } else {
          res.status(400).json({ message: 'Login or password are incorrect' });
        }
      }
    } else {
      res.status(400).send({ message: 'Bad request' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getUser = async (req, res) => {
  res.send(req.session.user);
};

exports.logout = (req, res) => {
  res
    .status(200)
    .send({ message: req.session.user.login + ' logged out successfully' });
  req.session.destroy();
};
