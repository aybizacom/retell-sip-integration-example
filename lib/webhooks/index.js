const express = require('express');
const endpoints = require('./endpoints');
const routes = express.Router();

routes.use('/', endpoints);

// Add GET handler for /retell to prevent H27 errors
routes.get('/retell', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = routes;
