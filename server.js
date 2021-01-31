require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

// Basic Configuration
var port = process.env.PORT || 3000;

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
let uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});


let urlSchema = new mongoose.Schema({ original : {type: String, required: true}, short : Number });
let Url = mongoose.model('Url', urlSchema);
let resObject = {};

app.post('/api/shorturl/new', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let inputUrl = req.body['url']

  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

    if(!inputUrl.match(urlRegex)) {
    res.json({error: 'Invalid URL'})
     return
  }

  resObject['original_url'] = inputUrl

  let inputShort = 1

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
            resObject['short_url'] = savedUrl.short
            res.json(resObject)
          }
        }
      )
    }
  })
});
app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input

  Url.findOne({short: input}, (err, result) => {
    if(!err && result != undefined) {
      res.redirect(result.original)
    } else {
      res.json('URL not Found');
    }
  })
});
