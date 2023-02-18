const Ads = require('../models/ads.model');

const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ads.find().populate('user'));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ads = await Ads.findById(req.param.id).populate('user');
    if (!ads) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      res.json(ads);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { title, content, date, price, location, sellerInfo } = sanitizedBody;

    const newAds = new Ads({
      title,
      content,
      date,
      price,
      location,
      sellerInfo,
    });
    await newAds.save();

    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  try {
    const existingAds = await Ads.findById(req.param.id).populate('user');
    if (!existingAds) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      const sanitizedBody = sanitize(req.body);
      const { title, content, date, price, location, sellerInfo } =
        sanitizedBody;
      (existingAds.title = title),
        (existingAds.content = content),
        (existingAds.date = date),
        (existingAds.price = price),
        (existingAds.location = location),
        (existingAds.sellerInfo = sellerInfo);
      await existingAds.save();
      res.json(existingAds);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const ads = await Ads.findById(req.param.id).populate('user');
    if (!ads) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      await Ads.deleteOne({ _id: req.param.id });
    }
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getBySearchPhrase = async (req, res) => {
  try {
    const matchingAds = await Ads.find({
      title: { $regex: req.params.searchPhrase },
    }).populate('user');
    if (!matchingAds) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      res.json(matchingAds);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
