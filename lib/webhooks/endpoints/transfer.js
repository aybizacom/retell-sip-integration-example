const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer request received');
  
  try {
    // Get the call SID from Retell's dynamic variables
    const callSid = payload.call?.retell_llm_dynamic_variables?.['"call-sid"'] ||
                   payload.call?.retell_llm_dynamic_variables?.['call-sid'] ||
                   payload.call_sid || 
                   payload.callSid;
    
    logger.info(`Extracted call SID: ${callSid}`);
    
    if (!callSid) {
      logger.error('No call SID provided for transfer');
      return res.status(400).json({ error: 'call_sid required' });
    }
    
    // Build Jambonz API URL
    const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${callSid}`;
    
    logger.info(`Making request to: ${jambonzUrl}`);
    logger.info('Request body:', JSON.stringify({
      call_hook: {
        url: `${process.env.APP_BASE_URL}/endpoints/transfer-execute`,
        method: 'POST'
      }
    }));
    
    const response = await fetch(jambonzUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        call_hook: {
          url: `${process.env.APP_BASE_URL}/endpoints/transfer-execute`,
          method: 'POST'
        }
      })
    });
    
    logger.info(`Response status: ${response.status}`);
    const responseText = await response.text();
    logger.info(`Response body: ${responseText}`);
    
    if (response.ok) {
      res.json({ status: 'transfer initiated' });
    } else {
      res.status(500).json({ error: 'Transfer failed' });
    }
    
  } catch (error) {
    logger.error({error}, 'Transfer request failed');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
