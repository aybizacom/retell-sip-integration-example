const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called');
  
  res.json([
    {
      verb: 'dial',
      callerId: payload.from,
      answerOnBridge: true,
      target: [
        {
          type: 'phone',
          number: process.env.UK_TRANSFER_NUMBER,
          trunk: process.env.PSTN_TRUNK_NAME
        }
      ],
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
