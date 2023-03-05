const fs = require('fs');
const bcrypt = require('bcryptjs');
const sanitize = require('mongo-sanitize');
const path = require('path');
const User = require('../models/user.model');
const getImageFileType = require('../utils/getImageFileType');

exports.register = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { login, password, phone } = sanitizedBody;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    if (
      login &&
      typeof login === 'string' &&
      password &&
      typeof password === 'string' &&
      req.file &&
      ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) &&
      phone &&
      typeof phone === 'string'
    ) {
      const userWithLogin = await User.findOne({ login });
      if (userWithLogin) {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            '../public/uploads',
            req.file.filename
          );
          fs.unlinkSync(filePath);
        }
        return res.status(409).json({ message: 'User already exists' });
      }
      const user = await User.create({
        login,
        password: await bcrypt.hash(password, 10),
        avatar: req.file.filename,
        phone,
      });
      res.status(201).send({ message: user.login + '  created successfully' });
    } else {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          '../public/uploads',
          req.file.filename
        );
        fs.unlinkSync(filePath);
      }
      return res.status(400).send({ message: 'Bad request' });
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
            login: user.login,
            avatar: user.avatar,
            phone: user.phone,
            _id: user._id,
          };

          res.status(200).send(req.session.user);
        } else {
          res.status(400).json({ message: 'Login or password are incorrect' });
        }
      }
    } else {
      res.status(400).send({ message: 'Bad request' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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
