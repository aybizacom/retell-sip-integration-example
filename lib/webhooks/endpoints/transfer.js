const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer request received');
  
  try {
    // Try both possible call identifiers
    const retellCallSid = payload.call?.retell_llm_dynamic_variables?.['call-sid'];
    const jambonzCid = payload.call?.retell_llm_dynamic_variables?.cid;
    
    logger.info(`Retell call SID: ${retellCallSid}, Jambonz CID: ${jambonzCid}`);
    
    // Use the call-sid first (this is likely the Jambonz call ID)
    const callId = retellCallSid;
    
    if (!callId) {
      logger.error('No call ID found for transfer');
      return res.status(400).json({ error: 'call_id required' });
    }
    
    // Use the standard Calls endpoint
    const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${callId}`;
    
    logger.info(`Making request to: ${jambonzUrl}`);
    
    const requestBody = {
      call_hook: {
        url: `${process.env.APP_BASE_URL}/transfer-execute`, // FIXED: Removed /endpoints
        method: 'POST'
      }
    };
    
    logger.info('Request body:', JSON.stringify(requestBody));
    
    const response = await fetch(jambonzUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    logger.info(`Response status: ${response.status}`);
    const responseText = await response.text();
    logger.info(`Response body: ${responseText}`);
    
    if (response.ok) {
      res.json({ status: 'transfer initiated' });
    } else {
      res.status(500).json({ error: 'Transfer failed', details: responseText });
    }
    
  } catch (error) {
    logger.error({error}, 'Transfer request failed');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
