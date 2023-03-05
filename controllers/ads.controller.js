const fs = require('fs');
const sanitize = require('mongo-sanitize');
const path = require('path');

const Ads = require('../models/ads.model');

const getImageFileType = require('../utils/getImageFileType');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ads.find().populate('user'));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ads = await Ads.findById(req.params.id).populate('user');
    if (!ads) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      res.json(ads);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getBySearchPhrase = async (req, res) => {
  try {
    const searchPhrase = req.params.searchPhrase.toLowerCase();
    const matchingAds = await Ads.find({
      title: { $regex: new RegExp(searchPhrase, 'i') },
    }).populate('user');
    if (!matchingAds) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      res.json(matchingAds);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { title, content, date, price, location } = sanitizedBody;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    if (
      title &&
      typeof title === 'string' &&
      title.length < 50 &&
      content &&
      typeof content === 'string' &&
      content.length < 1000 &&
      date &&
      typeof date === 'string' &&
      price &&
      typeof price === 'string' &&
      location &&
      typeof location === 'string' &&
      req.file &&
      ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)
    ) {
      const newAds = new Ads({
        title,
        content,
        date,
        photo: req.file.filename,
        price,
        location,
        user: req.session.user._id,
      });
      await newAds.save();

      res.json({ message: 'OK' });
    } else {
      const filePath = path.join(
        __dirname,
        '../public/uploads',
        req.file.filename
      );
      fs.unlinkSync(filePath);

      return res.status(400).send({ message: 'Bad request' });
    }
  } catch (error) {
    const filePath = path.join(
      __dirname,
      '../public/uploads',
      req.file.filename
    );
    fs.unlinkSync(filePath);
    res.status(500).json(error.message);
  }
};

exports.edit = async (req, res) => {
  try {
    const existingAds = await Ads.findById(req.params.id).populate('user');
    const sanitizedBody = sanitize(req.body);
    const { title, content, date, price, location } = sanitizedBody;

    if (existingAds) {
      (existingAds.title = title),
        (existingAds.content = content),
        (existingAds.date = date),
        (existingAds.price = price),
        (existingAds.location = location);

      if (req.file) {
        const fileType = req.file
          ? await getImageFileType(req.file)
          : 'unknown';
        if (['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
          const filePath = path.join(
            __dirname,
            '../public/uploads',
            existingAds.photo
          );
          existingAds.photo = req.file.filename;
          fs.unlinkSync(filePath);
        } else {
          const filePath = path.join(
            __dirname,
            '../public/uploads',
            req.file.filename
          );
          fs.unlinkSync(filePath);
          return res.status(400).send({ message: 'Bad request' });
        }
      }
      await existingAds.save();
      res.json(existingAds);
    } else {
      res.status(404).json({ message: 'Ads not found' });
    }
  } catch (err) {
    const filePath = path.join(__dirname, '../public/uploads', newPhoto);
    fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const ads = await Ads.findById(req.params.id);
    if (!ads) {
      res.status(404).json({ message: 'Ads not found' });
    } else {
      await Ads.deleteOne({ _id: req.params.id });
      const filePath = path.join(__dirname, '../public/uploads', ads.photo);
      fs.unlinkSync(filePath);
    }
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
