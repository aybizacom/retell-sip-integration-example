const router = require('express').Router();

router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/success', require('./success'));
router.use('/transfer-execute', require('./transfer-execute')); // ADD THIS LINE
router.use('/transfer', require('./transfer'));

module.exports = router;
