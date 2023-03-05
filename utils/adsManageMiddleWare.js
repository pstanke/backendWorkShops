const Ads = require('.././models/ads.model');

const adsManageMiddleware = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ message: 'You are not authorized' });
  }

  const adId = req.params.id;

  try {
    const ad = await Ads.findById(adId).populate('user');

    if (ad.user._id.toString() === req.session.user._id) {
      next();
    } else {
      res
        .status(401)
        .send({ message: 'You are not authorized to access this ad' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = adsManageMiddleware;
