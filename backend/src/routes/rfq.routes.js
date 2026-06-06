const express = require('express');
const rfqController = require('../controllers/rfq.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(rfqController.getAllRfqs)
  .post(restrictTo('ADMIN', 'PROCUREMENT_OFFICER'), rfqController.createRfq);

router.route('/:id')
  .get(rfqController.getRfqById);

module.exports = router;
