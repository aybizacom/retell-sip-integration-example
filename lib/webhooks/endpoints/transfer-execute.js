const router = require('express').Router();

// This hook starts the transfer process by dialing the agent.
router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.info({ payload }, '/transfer-execute called: INVITE with Replaces method');

  // The actionHook for this dial will trigger our replaces-hook,
  // but only if the agent answers the call.
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
          // We MUST use the Brightstar trunk for this to work
          trunk: process.env.PSTN_TRUNK_NAME
        }
      ],
      // This is the most important part
      actionHook: actionHookUrl,
      // We want to know about all call events
      actionHookEvents: ['answered'] 
    }
  ]);
});

module.exports = router;
