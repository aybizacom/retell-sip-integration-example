const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.info({ payload }, 'transfer-execute called: Refined Dial Attempt');

  // Validate that the required environment variables are set
  if (!process.env.UK_TRANSFER_NUMBER || !process.env.BRIGHTSTAR_MAIN_DID) {
    logger.error('Missing UK_TRANSFER_NUMBER or BRIGHTSTAR_MAIN_DID in .env file');
    return res.json([{
      verb: 'say',
      text: 'Sorry, the system is not configured correctly to transfer this call.'
    }, {
      verb: 'hangup'
    }]);
  }

  res.json([
    {
      verb: 'say',
      text: 'Please hold while I connect your call.'
    },
    {
      verb: 'dial',
      // CRITICAL: We set the callerId to your main trunk number.
      // This is more likely to be authorized by Brightstar for an outbound call.
      callerId: process.env.BRIGHTSTAR_MAIN_DID,
      answerOnBridge: true,
      target: [
        {
          type: 'phone',
          // Ensure UK_TRANSFER_NUMBER is in E.164 format without the '+'
          // Correct format: 442080404843
          number: process.env.UK_TRANSFER_NUMBER,
          // Explicitly tell Jambonz to use your Brightstar trunk
          trunk: 'Brightstar_03301790419'
        }
      ],
      // This hook will give us the final status of the transfer attempt
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
