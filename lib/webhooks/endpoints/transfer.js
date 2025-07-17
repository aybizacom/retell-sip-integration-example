const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer webhook received');
  
  if (payload.function_call && payload.function_call.name === 'transfer_to_uk_agent') {
    logger.info('🔄 TRANSFER DETECTED! Using Jambonz REST API...');
    
    const callId = payload.call_id;
    
    try {
      // Use Jambonz REST API to transfer the call
      const jambonzResponse = await fetch(`${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${callId}`, {
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
      
      logger.info('Jambonz transfer initiated');
      return res.json({ status: 'transfer_initiated' });
      
    } catch (error) {
      logger.error('Transfer failed:', error);
      return res.json({ status: 'transfer_failed' });
    }
  }
  
  res.sendStatus(200);
});

module.exports = router;
