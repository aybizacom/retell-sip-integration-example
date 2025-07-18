const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called');
  
  // Remove the + prefix for Brightstar
  const ukNumber = process.env.UK_TRANSFER_NUMBER.replace('+', '');
  
  res.json([
    {
      verb: 'dial',
      callerId: payload.from,
      answerOnBridge: true,
      target: [
        {
          type: 'phone',
          number: ukNumber,  // Now it's 442080404843 without +
          trunk: process.env.PSTN_TRUNK_NAME
        }
      ],
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
