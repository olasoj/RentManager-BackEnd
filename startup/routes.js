const express = require('express');
const user = require('../routes/users');
const admin = require('../routes/admins');
const auth = require('../routes/auth');
const complaint = require('../routes/complaints');

const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', user);
  app.use('/api/admins', admin);
  app.use('/api/auth', auth);
  app.use('/api/complains', complaint);

  app.use(error);
};
