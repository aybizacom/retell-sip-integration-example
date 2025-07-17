const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'dial action completed');
  
  // If dial succeeded AND was answered, do nothing (keep calls bridged)
  if (payload.dial_call_status === 'completed' && payload.dial_sip_status === 200) {
    logger.info('Call transferred successfully - keeping calls bridged');
    return res.json([]); // Empty = do nothing, keep calls connected
  }
  
  // If dial failed, properly decline the call
  logger.info('Call transfer failed - declining call');
  res.json([{
    "verb": "sip:decline",
    "status": 486,
    "reason": "Busy Here"
  }]);
});

module.exports = router;
