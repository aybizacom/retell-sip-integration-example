const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info('=== TRANSFER ENDPOINT HIT ===');
  logger.info({payload}, 'Full payload received');
  
  if (payload.function_call && payload.function_call.name === 'transfer_to_uk_agent') {
    logger.info('🔄 TRANSFER DETECTED! Using Jambonz REST API...');
    
    try {
      // Get the call ID from Retell payload
      const callId = payload.call_id;
      
      if (!callId) {
        logger.error('No call_id in payload');
        return res.json({ status: 'error', message: 'No call ID' });
      }
      
      // Use Jambonz REST API to redirect the call
      const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${callId}/redirect`;
      
      logger.info(`Calling Jambonz REST API: ${jambonzUrl}`);
      
      const response = await fetch(jambonzUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          call_hook: {
            url: `${process.env.APP_BASE_URL}/transfer-execute`,
            method: 'POST'
          }
        })
      });
      
      const responseText = await response.text();
      logger.info(`Jambonz response: ${response.status} - ${responseText}`);
      
      if (response.ok) {
        return res.json({ status: 'transfer_initiated' });
      } else {
        logger.error(`Jambonz API failed: ${response.status} - ${responseText}`);
        return res.json({ status: 'error', message: 'Transfer failed' });
      }
      
    } catch (error) {
      logger.error('Transfer error:', error);
      return res.json({ status: 'error', message: error.message });
    }
  }
  
  logger.info('=== END TRANSFER ENDPOINT ===');
  res.sendStatus(200);
});

module.exports = router;
