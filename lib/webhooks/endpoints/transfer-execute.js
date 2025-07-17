const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - but SIP REFER already handled transfer');
  
  // Return empty array since SIP REFER already transferred the call
  res.json([]);
});

module.exports = router;
