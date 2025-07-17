const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called');
  
  // Add explicit caller ID using environment variable
  res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone", 
        "number": process.env.UK_TRANSFER_NUMBER,
        "trunk": process.env.PSTN_TRUNK_NAME
      }],
      "answerOnBridge": true,
      "callerId": process.env.MAIN_UK_NUMBER  // Use environment variable
    }
  ]);
});

module.exports = router;
