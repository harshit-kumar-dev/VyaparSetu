const express = require('express');
const poController = require('../controllers/po.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('ADMIN', 'PROCUREMENT_OFFICER'), poController.generatePO);
router.get('/:id', poController.getPOById);

module.exports = router;
