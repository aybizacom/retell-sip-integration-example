const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'dial action completed');
  
  if (payload.dial_call_status === 'completed' || payload.dial_call_status === 'answered') {
    logger.info('Call connected successfully - bridging calls');
    return res.json([]);
  }
  
  logger.info('Call failed - hanging up');
  res.json([{
    verb: 'hangup'
  }]);
});

module.exports = router;
