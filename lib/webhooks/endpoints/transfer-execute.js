const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called');
  
  // This endpoint handles the actual transfer - dial to the UK agent number
  res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone",
        "number": process.env.UK_TRANSFER_NUMBER, // Add this environment variable
        "trunk": process.env.PSTN_TRUNK_NAME
      }],
      "answerOnBridge": true
    }
  ]);
});

module.exports = router;
