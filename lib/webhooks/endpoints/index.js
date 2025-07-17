const router = require('express').Router();

// Main application routes
router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/transfer-execute', require('./transfer-execute'));
router.use('/transfer', require('../transfer'));
// ADD THIS NEW ROUTE
router.use('/replaces-hook', require('./replaces-hook'));
// This can be a simple webhook that just returns a hangup verb
// router.use('/hangup-hook', require('./hangup-hook')); 

module.exports = router;
