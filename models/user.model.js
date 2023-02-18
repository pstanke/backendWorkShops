const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: Image, required: true },
  phone: { type: Number, required: true },
});

module.exports = mongoose.model('User', userSchema);
