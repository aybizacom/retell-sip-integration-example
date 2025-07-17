const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.info({ payload }, 'transfer-execute called: FINAL ATTEMPT - Diversion Header');

  // The original number that the customer dialed
  const originalDestination = payload.to;
  // The agent we are transferring to
  const agentNumber = process.env.UK_TRANSFER_NUMBER;
  // Brightstar's SIP host, from your .env file
  const brightstarHost = process.env.BRIGHTSTAR_SIP_HOST; // '77.108.130.19'

  if (!agentNumber || !brightstarHost) {
    logger.error('FATAL: Missing UK_TRANSFER_NUMBER or BRIGHTSTAR_SIP_HOST in .env');
    return res.json([{ verb: 'hangup' }]);
  }

  res.json([
    {
      verb: 'say',
      text: 'Please hold one moment.'
    },
    {
      verb: 'dial',
      // We present the original customer's Caller ID to the agent
      callerId: payload.from,
      target: [
        {
          type: 'phone',
          number: agentNumber,
          // We use the BRIGHTSTAR trunk for this attempt
          trunk: process.env.PSTN_TRUNK_NAME, // 'Brightstar_03301790419'
          headers: {
            // This is the official SIP header for call diversion/forwarding.
            // It tells Brightstar where the call was originally going.
            'Diversion': `<sip:${originalDestination}@${brightstarHost}>;reason=unconditional`
          }
        }
      ],
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
