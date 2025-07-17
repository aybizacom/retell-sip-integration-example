const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'executing transfer');
  
  const transferNumber = process.env.UK_TRANSFER_NUMBER;
  const fromNumber = payload.from;
  
  // Try without specifying trunk - let jambonz auto-route
  return res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone",
        "number": transferNumber
      }],
      "answerOnBridge": true,
      "callerId": fromNumber,
      "actionHook": "/dialAction"
    }
  ]);
});

module.exports = router;
