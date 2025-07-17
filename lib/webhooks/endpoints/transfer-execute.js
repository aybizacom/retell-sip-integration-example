const router = require('express').Router();

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.info({ payload }, 'transfer-execute called: FINAL ATTEMPT - SIP 302 Redirect');

  // Ensure required environment variables are set
  if (!process.env.UK_TRANSFER_NUMBER || !process.env.BRIGHTSTAR_SIP_HOST) {
    logger.error('Missing UK_TRANSFER_NUMBER or BRIGHTSTAR_SIP_HOST in .env file');
    // We can't redirect, so just hang up.
    return res.json([{ verb: 'hangup' }]);
  }

  // Construct the full SIP URI for the transfer destination.
  // Example: sip:442080404843@77.108.130.19
  const transferTargetSipUri = `sip:${process.env.UK_TRANSFER_NUMBER}@${process.env.BRIGHTSTAR_SIP_HOST}`;

  logger.info(`Attempting to redirect call to: ${transferTargetSipUri}`);

  // This is the SIP-native way to do a blind transfer.
  // We are telling the original carrier to redirect the call for us.
  res.json([
    {
      verb: 'sip:decline',
      status: 302,
      headers: {
        'Contact': `<${transferTargetSipUri}>`
      }
    }
  ]);
});

module.exports = router;
