const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 7, maxlength: 200, required: true },
  email: { type: String, minlength: 7, unique: true, required: true },
  password: { type: String, minlength: 6, maxlength: 120, required: true },
  room_number: { type: String, minlength: 1, maxlength: 3, required: true },
  number: { type: Number, minlength: 11, maxlength: 11, required: true },
  apartment_type: { type: String, maxlength: 12, required: true },
  avater: { type: String },
  date: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      room_number: this.room_number,
      avater: this.avater,
      number: this.number
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(body) {
  const schema = {
    name: Joi.string()
      .min(7)
      .max(200)
      .required(),
    email: Joi.string()
      .min(7)
      .email()
      .required(),
    password: Joi.string()
      .min(7)
      .max(200)
      .required(),
    room_number: Joi.string()
      .min(1)
      .max(3),
    number: Joi.string()
      .trim()
      .regex(/^[0-9]{11,11}$/)
      .required()
      .error(errors => {
        return {
          message: 'Enter a valid Phone Number.'
        };
      }),
    apartment_type: Joi.string()
      .max(12)
      .required()
  };

  return Joi.validate(body, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
