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
        "trunk": process.env.PSTN_TRUNK_NAME
      }],
      "actionHook": "/dialAction", // Fixed path - no /endpoints prefix
      "answerOnBridge": true
    }
  ]);
});

module.exports = router;
