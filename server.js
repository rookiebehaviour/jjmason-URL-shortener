require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

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
const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});


const urlSchema = new mongoose.Schema({ original : {type: String, required: true}, short : Number });
const Url = mongoose.model('Url', urlSchema);
let resObject = {};

app.post('/api/shorturl/new', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let inputUrl = req.body['url']

  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    if(!inputUrl.match(urlRegex)) {
    res.json({error: 'Invalid URL'})
    return
  }
  resObject['original_url'] = inputUrl;

  let inputShort = 1;

  Url.findOne({})
  .sort({short: 'desc'})
  .exec((err, result) => {
    if(!err && result !=undefined) {
      inputShort = result.short + 1
    }
    if(!err) {
      Url.findOneAndUpdate(
        {original: inputUrl},
        {original: inputUrl, short: inputShort},
        {new: true, upsert: true},
        (err, savedUrl) => {
          if(!err) {
            resObject['short_url'] = savedURL.short
            res.json(resObject)
          }
        }
      )
    }
  })
});

app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input;

  Url.findOne({short: input}, (err, result) => {
    if(!err && result != undefined) {
      res.redirect(result.original)
    } else {
      res.json('URL not Found');
    }
  })
});
