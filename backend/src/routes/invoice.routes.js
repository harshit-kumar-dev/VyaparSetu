const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('ADMIN', 'VENDOR'), invoiceController.generateInvoice);
router.get('/:id', invoiceController.getInvoiceById);

module.exports = router;
