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

exports.create = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { title, content, date, price, location, sellerInfo } = sanitizedBody;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    if (
      title &&
      typeof title === 'string' &&
      content &&
      typeof content === 'string' &&
      date &&
      typeof date === 'string' &&
      price &&
      typeof price === 'number' &&
      location &&
      typeof location === 'string' &&
      sellerInfo &&
      typeof sellerInfo === 'string' &&
      req.file &&
      ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)
    ) {
      const newAds = new Ads.create({
        title,
        content,
        date,
        photo: req.file.filename,
        price,
        location,
        sellerInfo,
      });
      await newAds.save();

      res.json({ message: 'OK' });
    } else {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          '../public/uploads',
          req.file.filename
        );
        fs.unlinkSync(filePath);
      }
      res.status(400).send({ message: 'Bad request' });
    }
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
      const { title, content, date, newPhoto, price, location, sellerInfo } =
        sanitizedBody;
      (existingAds.title = title),
        (existingAds.content = content),
        (existingAds.date = date),
        (existingAds.price = price),
        (existingAds.location = location),
        (existingAds.sellerInfo = sellerInfo);
      if (newPhoto) {
        const fileType = await getImageFileType(newPhoto);
        if (['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
          const filePath = path.join(
            __dirname,
            '../public/uploads',
            existingAds.photo
          );
          fs.unlinkSync(filePath);
          existingAds.photo = newPhoto;
        } else {
          res.status(400).send({ message: 'Bad request' });
        }
      }
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
