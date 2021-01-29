require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

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

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//Database Connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true});
let urlSchema = new mongoose.Schema({ original : {type: String, required: true}, short : Number
});
let url = mongoose.model('Url', urlSchema);
let responseObject = {}

app.post('/api/shorturl/new', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let inputUrl = request.body['url']
  dns.lookup({url_input}, function onLookup(err, addresses, family) {
    console.log('addresses:', addresses);
  })
  responseObject['original_url'] = inputUrl

  let inputShort = 1

  Url.findOne({})
  .sort({short: 'desc'})
  .exec((error, result) => {
    if(!error && result !=undefined) {
      inputShort = result.short + 1
    }
    if(!error) {
      Url.findOneAndUpdate(
        {original: inputUrl},
        {original: originalUrl, short: inputShort},
        {new: true, upsert: true},
        (error, savedUrl) => {
          if(!error) {
            responseObject['short_url'] = savedURL.shorturlresponse.json(responseObject)
          }
        }
      )
    }
  })
});
