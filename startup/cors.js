const cors = require('cors');

const config = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Content-Length',
    'X-Requested-With',
    'x-auth-token'
  ]
};

module.exports = function(app) {
  app.use(cors(config));
};
