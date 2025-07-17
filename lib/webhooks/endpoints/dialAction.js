const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'dial action completed');
  
  // If dial succeeded, do nothing (let the calls stay connected)
  if (payload.dial_call_status === 'completed' || payload.dial_call_status === 'answered') {
    logger.info('Call connected successfully - bridging calls');
    return res.json([]); // Empty response = do nothing, keep calls connected
  }
  
  // If dial failed, hang up
  logger.info('Call failed - hanging up');
  res.json([{
    "verb": "hangup"
  }]);
});

module.exports = router;
