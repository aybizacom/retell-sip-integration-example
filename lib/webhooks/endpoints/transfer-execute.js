const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'executing transfer');
  
  const transferNumber = process.env.UK_TRANSFER_NUMBER;
  const mainNumber = process.env.MAIN_UK_NUMBER;
  
  logger.info(`Transfer config: transferNumber=${transferNumber}, mainNumber=${mainNumber}`);
  
  if (!transferNumber || !mainNumber) {
    logger.error('Missing environment variables for transfer');
    return res.json([{"verb": "hangup"}]);
  }
  
  const dialConfig = {
    "verb": "dial",
    "target": [{
      "type": "phone",
      "number": transferNumber,
      "trunk": "Brightstar_03301790419"
    }],
    "answerOnBridge": true,
    "callerId": mainNumber
  };
  
  logger.info({dialConfig}, 'Sending dial configuration');
  
  return res.json([dialConfig]);
});

module.exports = router;
