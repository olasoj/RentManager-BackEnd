//load mongoose
const mongoose = require('mongoose');
//load config
const config = require('config');
//load logger
const logger = require('../startup/logging');
//get the mongodb connection link
const db = config.get('mongoURI');

//connect to mongoose
module.exports = async function connDB() {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    logger.info('connected to mongoDB');
  } catch (ex) {
    console.log(ex.message);
    //Terminate the process
    process.exit(1);
  }
};
