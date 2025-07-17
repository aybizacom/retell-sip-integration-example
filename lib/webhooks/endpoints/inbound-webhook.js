const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'inbound webhook');
  
  res.json([
    {
      verb: 'dial',
      target: [{
        type: 'phone',
        number: payload.to,
        trunk: process.env.PSTN_TRUNK_NAME
      }],
      actionHook: '/dialAction',
      answerOnBridge: true
    }
  ]);
});

module.exports = router;
