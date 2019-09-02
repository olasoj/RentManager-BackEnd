const express = require('express');
const router = express.Router();

//middleware
const authMiddleware = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');

// model
const { Complaint, validateCompliant } = require('../models/complaint');

/**
 * /complains GET
 * Public
 */
router.get('/', async (req, res) => {
  const compliant = await Complaint.find();
  if (!compliant) return res.status(404).send('No Compliant Found');
  res.send(compliant);
});

router.get('/:id', [validateObjectId, authMiddleware], async (req, res) => {
  const compliant = await Complaint.findById(req.params.id);
  if (!compliant) return res.status(404).send('No Compliant Found');
  res.send(compliant);
});

router.post('/', [authMiddleware], async (req, res) => {
  const { error } = validateCompliant(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const complaint = await new Complaint({
    title: req.body.title,
    complain_category: req.body.complain_category,
    body: req.body.body,
    user: {
      _id: req.user._id,
      name: req.user.name,
      room_number: req.user.room_number,
      number: req.user.number,
      avater: req.user.avater
    }
  });

  await complaint.save();
  res.send(complaint);
});

router.put('/:id', [validateObjectId, authMiddleware], async (req, res) => {
  const { error } = validateCompliant(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const compliant = await Complaint.findById(req.params.id);
  if (!compliant) return res.status(404).send('Compliant not found');

  compliant.set({
    title: req.body.title,
    complain_category: req.body.complain_category,
    body: req.body.body
  });

  await compliant.save();
  res.send(compliant);
});

router.put(
  '/resolve/:id',
  [validateObjectId, authMiddleware, admin],
  async (req, res) => {
    const compliant = await Complaint.findById(req.params.id);
    if (!compliant) return res.status(404).send('Compliant not found');

    compliant.is_resolved === true
      ? (compliant.is_resolved = false)
      : (compliant.is_resolved = true);

    await compliant.save();
    res.send(compliant);
  }
);

router.delete('/:id', [validateObjectId, authMiddleware], async (req, res) => {
  const compliant = await Complaint.findByIdAndDelete(req.params.id);
  if (!compliant) return res.status(404).send('Compliant not found');

  res.send(compliant);
});

module.exports = router;
