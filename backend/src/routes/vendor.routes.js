const express = require('express');
const vendorController = require('../controllers/vendor.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All vendor routes require authentication

router.route('/')
  .get(vendorController.getAllVendors)
  .post(restrictTo('ADMIN', 'PROCUREMENT_OFFICER'), vendorController.createVendor);

router.route('/:id')
  .get(vendorController.getVendorById)
  .put(restrictTo('ADMIN', 'PROCUREMENT_OFFICER'), vendorController.updateVendor)
  .delete(restrictTo('ADMIN'), vendorController.deleteVendor);

module.exports = router;
