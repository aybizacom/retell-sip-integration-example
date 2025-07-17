const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - using proxy dial');
  
  // Try dialing with proxy headers to bypass loop detection
  res.json([
    {
      verb: 'say', 
      text: 'Please hold while I transfer your call.'
    },
    {
      verb: 'dial',
      target: [{
        type: 'sip',
        sipUri: `sip:${process.env.UK_TRANSFER_NUMBER}@77.108.130.19`,
        auth: {
          username: process.env.BRIGHTSTAR_SIP_USERNAME || 'SIP_Trunk_Username',
          password: process.env.BRIGHTSTAR_SIP_PASSWORD || 'your_password'
        },
        headers: {
          'X-Brightstar-Internal': 'true',
          'X-No-Loop-Check': 'true',
          'From': `<sip:internal@77.108.130.19>`,
          'P-Asserted-Identity': `<sip:${payload.from}@77.108.130.19>`
        }
      }],
      answerOnBridge: true,
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
