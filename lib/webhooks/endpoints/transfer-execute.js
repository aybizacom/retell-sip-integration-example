const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called');
  
  // Use SIP REFER for blind transfer instead of dial
  res.json([
    {
      "verb": "refer",
      "referTo": `sip:${process.env.UK_TRANSFER_NUMBER}@77.108.130.19`,
      "actionHook": "/dialAction"
    }
  ]);
});

module.exports = router;
