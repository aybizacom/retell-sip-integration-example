const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'executing transfer');
  
  const transferNumber = process.env.UK_TRANSFER_NUMBER;
  const sipGateway = process.env.BRIGHTSTAR_SIP_GATEWAY;
  const fromNumber = payload.from;
  
  return res.json([
    {
      "verb": "sip:refer",
      "referTo": `sip:${transferNumber}@${sipGateway}`,
      "referBy": fromNumber,
      "headers": {
        "Referred-By": fromNumber
      }
    }
  ]);
});

module.exports = router;
