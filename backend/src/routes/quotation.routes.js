const express = require('express');
const quotationController = require('../controllers/quotation.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('VENDOR'), quotationController.submitQuotation);
router.get('/:id', quotationController.getQuotationById);
router.get('/rfq/:rfqId', restrictTo('ADMIN', 'PROCUREMENT_OFFICER'), quotationController.getQuotationsByRfq);

module.exports = router;
