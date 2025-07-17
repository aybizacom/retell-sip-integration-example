const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'executing transfer');
  
  const transferNumber = process.env.UK_TRANSFER_NUMBER;
  const fromNumber = payload.from;
  
  return res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone",
        "number": transferNumber,
        "trunk": "Brightstar_03301790419"  // Use your trunk explicitly
      }],
      "answerOnBridge": true,
      "callerId": "443301790419",  // Use your main number as caller ID
      "actionHook": "/dialAction"
    }
  ]);
});

module.exports = router;
