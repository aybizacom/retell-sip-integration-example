const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer request received');
  
  try {
    const callId = payload.call?.retell_llm_dynamic_variables?.['call-sid'];
    
    if (!callId) {
      logger.error('No call ID found for transfer');
      return res.status(400).json({ error: 'call_id required' });
    }
    
    const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${callId}`;
    
    const response = await fetch(jambonzUrl, {
      method: 'PUT',
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
    
    if (response.ok) {
      res.json({ status: 'transfer initiated' });
    } else {
      const responseText = await response.text();
      res.status(500).json({ error: 'Transfer failed', details: responseText });
    }
    
  } catch (error) {
    logger.error({error}, 'Transfer request failed');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
