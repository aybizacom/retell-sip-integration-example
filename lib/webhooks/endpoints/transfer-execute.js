const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.info({ payload }, 'transfer-execute: INVITE w/ Replaces - Step 1: Dialing agent');

  const actionHookUrl = `${process.env.APP_BASE_URL}/replaces-hook?original_call_sid=${payload.call_sid}`;

  res.json([
    {
      verb: 'say',
      text: 'Please hold while I connect your call.'
    },
    {
      verb: 'dial',
      callerId: payload.from,
      target: [
        {
          type: 'phone',
          number: process.env.UK_TRANSFER_NUMBER,
          trunk: process.env.PSTN_TRUNK_NAME, // Use Brightstar trunk
        }
      ],
      actionHook: actionHookUrl,
      actionHookEvents: ['answered'], // Trigger hook ONLY on answer
    }
  ]);
});

module.exports = router;
