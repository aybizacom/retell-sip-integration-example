const router = require('express').Router();

router.use('/agent-events', require('./agent-events'));
router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/success', require('./success'));
router.use('/transfer', require('./transfer')); // ADD THIS LINE
router.use('/transfer-execute', require('./transfer-execute')); // ADD THIS LINE

module.exports = router;
