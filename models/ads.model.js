const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 10, maxlength: 50 },
  content: { type: String, required: true, minlength: 20, maxlength: 1000 },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  sellerInfo: { type: String, required: true, ref: 'User' },
});
module.exports = mongoose.model('Ads', adsSchema);
