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
        "number": "YOUR_RETELL_PHONE_NUMBER", // Replace with actual Retell number
        "trunk": "YOUR_TRUNK_NAME" // Replace with your trunk
      }],
      "answerOnBridge": true
    }
  ]);
});

module.exports = router;
