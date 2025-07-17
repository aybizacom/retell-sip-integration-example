const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info('=== TRANSFER ENDPOINT HIT ===');
  logger.info({payload}, 'Full payload received');
  
  if (payload.call && payload.args) {
    logger.info('🔄 CUSTOM FUNCTION DETECTED! Executing SIP REFER...');
    
    const transferNumber = process.env.UK_TRANSFER_NUMBER;
    const sipGateway = process.env.BRIGHTSTAR_SIP_GATEWAY;
    const fromNumber = payload.call.from_number;
    
    // Use the jambonz call ID from dynamic variables, not Retell call ID
    const jambonzCallId = payload.call.retell_llm_dynamic_variables['call-sid'];
    
    logger.info(`Transferring jambonz call ${jambonzCallId} from ${fromNumber} to ${transferNumber}`);
    
    if (!jambonzCallId) {
      logger.error('No jambonz call-sid found in dynamic variables');
      return res.json({ result: 'Transfer failed - no call ID' });
    }
    
    try {
      // Use jambonz REST API to redirect the call with correct call ID
      const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${jambonzCallId}/redirect`;
      
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
        return res.json({ result: 'Transfer initiated successfully' });
      } else {
        logger.error(`Transfer failed: ${response.status} - ${responseText}`);
        return res.json({ result: 'Transfer failed, please try again' });
      }
      
    } catch (error) {
      logger.error('Transfer error:', error);
      return res.json({ result: 'Transfer failed due to technical error' });
    }
  } else {
    logger.info('No call/args found in payload');
    return res.json({ result: 'Invalid request' });
  }
});

module.exports = router;
