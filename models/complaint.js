const mongoose = require('mongoose');
const Joi = require('joi');

const complaintSchema = new mongoose.Schema({
  title: { type: String, minlength: 7, maxlength: 100, required: true },
  complain_category: { type: String, maxlength: 18, required: true },
  body: { type: String, minlength: 7, maxlength: 2500, required: true },
  is_resolved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  user: new mongoose.Schema({
    name: { type: String },
    room_number: { type: Number },
    number: { type: Number },
    avater: { type: String }
  })
});

const Complaint = mongoose.model('Complaint', complaintSchema);

function validateCompliant(body) {
  const schema = {
    title: Joi.string()
      .min(7)
      .max(100)
      .required(),
    complain_category: Joi.string()
      .max(18)
      .required(),
    body: Joi.string()
      .min(7)
      .max(2500)
      .required(),
    is_resolved: Joi.boolean(),
    date: Joi.date()
  };

  return Joi.validate(body, schema);
}

module.exports.Complaint = Complaint;
module.exports.validateCompliant = validateCompliant;
