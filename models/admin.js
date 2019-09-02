const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const adminSchema = new mongoose.Schema({
  name: { type: String, minlength: 7, maxlength: 200, required: true },
  email: { type: String, minlength: 7, unique: true, required: true },
  password: { type: String, minlength: 6, maxlength: 120, required: true },
  number: { type: Number, minlength: 11, maxlength: 11, required: true },
  avater: { type: String },
  is_admin: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
});

adminSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      number: this.number,
      isAdmin: this.is_admin
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const Admin = mongoose.model('Admin', adminSchema);

function validateAdmin(body) {
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
    number: Joi.string()
      .trim()
      .regex(/^[0-9]{11,11}$/)
      .required()
      .error(errors => {
        return {
          message: 'Enter a valid Phone Number.'
        };
      }),
    is_admin: Joi.boolean()
  };

  return Joi.validate(body, schema);
}

module.exports.Admin = Admin;
module.exports.validateAdmin = validateAdmin;
