const express = require('express');
const router = express.Router();

const gravater = require('gravatar');

//import the admin model
const { Admin, validateAdmin } = require('../models/admin');

// import bcrypt //hash password
const bcrypt = require('bcrypt');

router.get('/me', (req, res) => {
  res.send('pppp');
});

router.post('/', async (req, res) => {
  //validate input
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, number } = req.body;

  //check if the email
  const emailExist = await Admin.findOne({ email });
  if (emailExist) return res.status(400).send('Email already registered');

  const avater = gravater.url(email, {
    s: '200', //size
    r: 'pg', //rating
    d: 'mm' //default
  });

  //hash password
  const password = await bcrypt.hash(req.body.password, 10);

  //create new admin
  const admin = await new Admin({
    name,
    email,
    password,
    number,
    avater
  });

  //save to the database
  await admin.save();
  const token = admin.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send('registered');
});

module.exports = router;
