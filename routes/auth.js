const express = require('express');
const router = express.Router();

const Joi = require('joi');
const bcrypt = require('bcrypt');

// model
const { User } = require('../models/user');
const { Admin } = require('../models/admin');

router.post('/', async (req, res) => {
  //validate the input
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  //check if email exist
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid Username or Password ');

  //compare the password
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Invalid Username or Password ');

  //generate a token
  const token = user.generateAuthToken();
  res.send(token);
});

router.post('/admin', async (req, res) => {
  //validate the input
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  //check if email exist
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).send('Invalid Username or Password ');

  //compare the password
  const validPass = await bcrypt.compare(password, admin.password);
  if (!validPass) return res.status(400).send('Invalid Username or Password ');

  //generate a token
  const token = admin.generateAuthToken();
  res.send(token);
});

function validateAuth(body) {
  schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };
  return Joi.validate(body, schema);
}

module.exports = router;
