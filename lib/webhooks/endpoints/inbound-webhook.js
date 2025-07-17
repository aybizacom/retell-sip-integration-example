const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'inbound webhook');
  
  // Return jambonz application format (array of verbs)
  res.json([
    {
      "verb": "dial",
      "target": [{
        "type": "phone",
        "number": payload.to,
        "trunk": process.env.RETELL_TRUNK_NAME
      }],
      "actionHook": "/endpoints/dialAction", // CRITICAL: This was missing!
      "answerOnBridge": true
    }
  ]);
});

module.exports = router;
