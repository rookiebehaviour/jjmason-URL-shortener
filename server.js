require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true});

const Schema = new mongoose.Schema({ url: 'String' });
const url = mongoose.model('url', Schema);

app.use(cors());
app.use(bodyParser.urlencoded({ entended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shortcut/new', function(req, res) {
  const bodyurl = req.body.url;
  const lookup = dns.lookup(urlparser.parse(bodyurl).hostname, (err, address) => {
    if (!address) {
      res.json({ error: "Invalid URL" })
    } else {
      const url = new url({ url: bodyurl})
      url.save(err, data) => {
        res.json({
          original_url: data.url,
          short_url: data.id
        })
      }
    }
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
