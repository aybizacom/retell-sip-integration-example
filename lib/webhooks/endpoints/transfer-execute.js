const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - using bridge transfer');
  
  // Instead of conference, use bridge verb to connect directly
  res.json([
    {
      verb: 'say',
      text: 'Please wait while I connect you to an agent.'
    },
    {
      verb: 'bridge',
      callSid: payload.call_sid,  // Bridge the current call
      actionHook: '/bridge-status'
    },
    {
      verb: 'dial',
      target: [{
        type: 'phone', 
        number: process.env.UK_TRANSFER_NUMBER,
        trunk: 'Brightstar_03301790419',
        headers: {
          'X-Transfer-Type': 'internal',
          'X-Original-CallID': payload.call_id,
          'P-Charge-Info': `<sip:${payload.from}@54.236.168.131>`,
          'Privacy': 'none'
        }
      }],
      callerId: payload.from,
      answerOnBridge: true,
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
