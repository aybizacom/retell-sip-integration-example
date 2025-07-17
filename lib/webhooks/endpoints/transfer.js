const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer webhook received');
  
  // Handle transfer_to_uk_agent function from Retell
  if (payload.function_call && payload.function_call.name === 'transfer_to_uk_agent') {
    logger.info('🔄 TRANSFER DETECTED! Executing SIP REFER...');
    
    const transferNumber = process.env.UK_TRANSFER_NUMBER;
    const sipGateway = process.env.BRIGHTSTAR_SIP_GATEWAY;
    const fromNumber = payload.from_number || payload.from;
    
    // Return jambonz instructions to transfer the call
    return res.json([
      {
        "verb": "sip:refer",
        "referTo": `sip:${transferNumber}@${sipGateway}`,
        "referBy": fromNumber,
        "headers": {
          "Referred-By": fromNumber,
          "P-Asserted-Identity": fromNumber
        }
      }
    ]);
  }
  
  // Default response for other requests
  res.sendStatus(200);
});

module.exports = router;
