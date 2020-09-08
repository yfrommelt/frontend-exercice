'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const users = require('../fake');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/users', (req, res) => {
  return res.json(users.map(user => ({id: user.id, name: user.name})))
});
router.get('/avg', (req, res) => {
  return res.json(req.body)

  const ids = req.body.ids
  const years = users.filter(user => ids.indexOf(user.id) !== -1).map(user => user.year)
  const avg = (years / years.length) * years.length
  return res.json({ avg })
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
