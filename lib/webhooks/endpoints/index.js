const router = require('express').Router();

router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/transfer-execute', require('./transfer-execute'));
router.use('/transfer', require('../transfer'));
router.use('/replaces-hook', require('./replaces-hook'));
router.use('/hangup-hook', require('./hangup-hook'));

module.exports = router;
