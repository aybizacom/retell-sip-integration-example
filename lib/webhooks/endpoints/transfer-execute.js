const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - REFER method');
  
  // Remove + from UK number for SIP URI format
  const ukNumber = process.env.UK_TRANSFER_NUMBER.replace('+', '');
  
  res.json([
    {
      verb: 'sip:refer',
      referTo: `sip:${ukNumber}@${process.env.BRIGHTSTAR_SIP_GATEWAY}`,
      referredBy: `sip:${payload.from}@${process.env.BRIGHTSTAR_SIP_GATEWAY}`,
      actionHook: '/dialAction'
    }
  ]);
});

module.exports = router;
