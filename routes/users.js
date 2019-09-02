const express = require('express');
const router = express.Router();

const gravater = require('gravatar');

//import the user model
const { User, validateUser } = require('../models/user');

// import bcrypt //hash password
const bcrypt = require('bcrypt');

const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get('/me', (req, res) => {
  res.send('pppp');
});

router.post('/', [auth, isAdmin], async (req, res) => {
  //validate input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, room_number, number, apartment_type } = req.body;

  //check if the email
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).send('Email already registered');
  //check if the room is already occupied
  const roomExist = await User.findOne({ room_number });
  if (roomExist) return res.status(400).send('Room Occupied');

  const avater = gravater.url(email, {
    s: '200', //size
    r: 'pg', //rating
    d: 'mm' //default
  });

  //hash password
  const password = await bcrypt.hash(req.body.password, 10);

  //create new user
  const user = await new User({
    name,
    email,
    password,
    room_number,
    number,
    apartment_type,
    avater
  });

  //save to the database
  await user.save();
  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send('registered');
});

module.exports = router;
