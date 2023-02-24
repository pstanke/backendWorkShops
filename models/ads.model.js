const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 10, max: 50 },
  content: { type: String, required: true, min: 20, max: 1000 },
  date: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  user: { type: String, required: true, ref: 'User' },
});
module.exports = mongoose.model('Ads', adsSchema);
