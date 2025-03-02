require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { shortenUrl, getOriginalUrl } = require('./services/UrlShortenedService');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async function(req, res) {
  const url = req.body.url

  try {
    const result = await shortenUrl(url);
    res.json(result);
  } catch (err) {
    res.json({error: err.message})
  }
})

app.get('/api/shorturl/:shortUrl', async function(req, res) {
  const shortUrl = req.params.shortUrl;

  try {
    const originalUrl = await getOriginalUrl(shortUrl)
    res.redirect(301, originalUrl)
  } catch (err) {
    res.json({error: err.message})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
