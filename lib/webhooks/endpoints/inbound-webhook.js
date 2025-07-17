const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  logger.info({payload}, 'inbound webhook');

  // CHECK FOR TRANSFER TRIGGER IN TRANSCRIPT
  if (payload.transcript && payload.transcript.toLowerCase().includes('transfer')) {
    logger.info('🔄 TRANSFER DETECTED IN TRANSCRIPT!');
    
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
  }

  // Your existing logic
  res.json({
    call_inbound: {
      dynamic_variables: {
         user_name: 'John Doe',
         user_email: 'john@example.com'
      },
      metadata: {
        random_id: '12345'
      }
    }
  });
});

module.exports = router;
