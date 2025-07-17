const router = require('express').Router();

// Main application routes
router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/transfer-execute', require('./transfer-execute'));
router.use('/transfer', require('../transfer'));

// The hook that executes the final transfer command
router.use('/replaces-hook', require('./replaces-hook'));

// The hook that cleans up the call after a successful transfer
router.use('/hangup-hook', require('./hangup-hook'));

module.exports = router;
