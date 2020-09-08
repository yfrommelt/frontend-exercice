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
  return res.json(users.map(user => ({ id: user.id, name: user.name })))
});
router.get('/average', (req, res) => {
  const { ids, noerror } = req.body

  if (!noerror) {
    res.statusCode = 400
    return res.json({error: `Un parametre "noerror": true doit être envoyé à l'API avec les ids des utilisateur. 
    Prends en compte cette erreur et affiche la sur l'application quand elle survient (cas a codé en dur dans ton code).`})
  }

  const years = users.filter(user => ids.indexOf(user.id) !== -1).map(user => user.year)
  const average = years.reduce((p, c, _, a) => p + c / a.length, 0)
  return res.json({ average })
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
