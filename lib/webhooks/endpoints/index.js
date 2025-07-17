const router = require('express').Router();

router.use('/inbound-webhook', require('./inbound-webhook'));
router.use('/dialAction', require('./dialAction'));
router.use('/success', require('./success'));
router.use('/transfer-execute', require('./transfer-execute'));
router.use('/transfer', require('./transfer'));
router.use('/agent-events', require('./agent-events'));

module.exports = router;
