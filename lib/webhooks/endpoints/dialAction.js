const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'dial action completed');
  
  // End the call after transfer
  res.json([{
    "verb": "hangup"
  }]);
});

module.exports = router;
