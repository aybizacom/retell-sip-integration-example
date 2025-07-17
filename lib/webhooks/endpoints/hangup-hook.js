const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.info('/hangup-hook called, terminating call');
  
  res.json([
    {
      verb: 'hangup'
    }
  ]);
});

module.exports = router;
