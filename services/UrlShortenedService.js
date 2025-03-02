const ShortenedUrl = require("../models/ShortenedUrl");
const isValidHttpUrl = require("../utils/isValidHttpUrl");

async function shortenUrl(url) {
  if (!isValidHttpUrl(url)) {
    throw new Error('invalid url')
  }

  let data = await ShortenedUrl.findOne({ originalUrl: url});

  if (!data) {
    const maxDoc = await ShortenedUrl.find().sort({ _id: -1 }).limit(1);
    const shortUrlId = maxDoc.length > 0 ? maxDoc[0].shortUrl + 1 : 1;
    const shortenedUrl = new ShortenedUrl({ originalUrl: url, shortUrl: shortUrlId });
    data = await shortenedUrl.save();
  }

  return {
    original_url: data.originalUrl,
    short_url: data.shortUrl
  }
}

async function getOriginalUrl(shortUrl) {
  const data = await ShortenedUrl.findOne({ shortUrl: Number(shortUrl) });

  if (!data) {
    throw new Error('No short url found for the given input');
  }

  return data.originalUrl
}

module.exports = {
  shortenUrl,
  getOriginalUrl
}
