const { createLogger, format, transports } = require('winston');
require('express-async-errors');

module.exports = createLogger({
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 5120000,
      maxFiles: 5
    }),
    new transports.File({
      filename: 'combined.log',
      maxsize: 5120000,
      maxFiles: 5
    }),
    new transports.Console({ colorize: true, prettyPrint: true })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
    new transports.Console({ colorize: true, prettyPrint: true })
  ]
});
