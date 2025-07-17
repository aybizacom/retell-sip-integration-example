const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'executing transfer');
  
  const transferNumber = process.env.UK_TRANSFER_NUMBER;
  const mainNumber = process.env.MAIN_UK_NUMBER;
  
  return res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone",
        "number": transferNumber,
        "trunk": "Brightstar_03301790419"
      }],
      "answerOnBridge": true,
      "callerId": mainNumber,
      "actionHook": "/dialAction"  // PUT THIS BACK!
    }
  ]);
});

module.exports = router;
