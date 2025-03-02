const mongoose = require('mongoose');

const shortenedUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: Number
})

module.exports = mongoose.model('ShortenedUrl', shortenedUrlSchema)