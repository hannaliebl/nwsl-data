var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var fs = require('fs');

var server = module.exports.server = exports.server = express();

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', function (req, res) {
  res.render('./public/index.html');
});

server.get('/api/:year', function (req, res) {
  if (req.params.year === "2014") {
    fs.readFile(__dirname +'/data/2014.json', 'utf8', function (err, data) {
      if (err) throw err;
      data = JSON.parse(data);
      res.json(data);
    });
  } else {
    res.status(404).send("404: Not Found").end();
  }
});

server.set('port', process.env.PORT || 3000);

server.listen(server.get('port'), function() {
  console.log('Express server listening on port # ' + server.get('port'));
});