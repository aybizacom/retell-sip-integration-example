const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.info({ payload: req.body }, 'transfer-execute: Reverted to simple Bridge Carrier method');

  // These variables MUST exist in your environment settings
  const transferTrunk = process.env.TRANSFER_TRUNK_NAME;
  const callerId = process.env.TWILIO_CALLER_ID;
  const agentNumber = process.env.UK_TRANSFER_NUMBER;

  res.json([
    {
      verb: 'say',
      text: 'Please hold while I connect you.'
    },
    {
      verb: 'dial',
      callerId: callerId,
      answerOnBridge: true,
      target: [
        {
          type: 'phone',
          number: agentNumber,
          // Use the Twilio trunk to bypass the Brightstar block
          trunk: transferTrunk
        }
      ],
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
