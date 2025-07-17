const router = require('express').Router();

router.use('/agent-events', require('./agent-events'));
router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/success', require('./success'));
router.use('/transfer', require('./transfer'));
router.use('/transfer-execute', require('./transfer-execute'));

module.exports = router;
