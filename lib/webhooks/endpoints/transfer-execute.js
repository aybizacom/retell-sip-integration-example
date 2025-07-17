const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - using reinvite');
  
  // Use reinvite to change the call destination
  res.json([
    {
      verb: 'say',
      text: 'Transferring your call now.'
    },
    {
      verb: 'sip:reinvite',
      sipUri: `sip:${process.env.UK_TRANSFER_NUMBER}@77.108.130.19`,
      headers: {
        'X-Transfer': 'internal-brightstar',
        'X-Loop-Detect': 'false'
      }
    }
  ]);
});

module.exports = router;
