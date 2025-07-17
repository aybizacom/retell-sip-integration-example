const router = require('express').Router();

// Main application routes
router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/transfer-execute', require('./transfer-execute'));
router.use('/transfer', require('../transfer'));

module.exports = router;
