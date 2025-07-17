const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - correct trunk approach');
  
  // Remove the + from UK number - Brightstar might not expect it
  const ukNumber = process.env.UK_TRANSFER_NUMBER.replace('+', '');
  
  res.json([
    {
      verb: 'say',
      text: 'Please hold while I transfer your call.'
    },
    {
      verb: 'dial',
      target: [{
        type: 'phone',  // NOT 'sip' - this ensures trunk is used
        number: ukNumber,  // Try without +
        trunk: 'Brightstar_03301790419',  // Explicit trunk
        headers: {
          'X-Internal-Transfer': 'true',
          'X-Original-Caller': payload.from,
          'X-Bypass-Loop': 'true'
        }
      }],
      callerId: payload.from,
      answerOnBridge: true,
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
