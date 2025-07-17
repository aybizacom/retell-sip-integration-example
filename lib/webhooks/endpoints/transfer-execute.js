const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer-execute called - using conference bridge');
  
  // Generate unique conference name
  const conferenceId = `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  res.json([
    {
      verb: 'say',
      text: 'Please wait while I connect you to an agent.'
    },
    {
      verb: 'conference',
      name: conferenceId,
      beep: false,
      startConferenceOnEnter: true,
      endConferenceOnExit: false,
      waitHook: {
        url: `${process.env.APP_BASE_URL}/conference-wait`,
        method: 'POST'
      }
    }
  ]);
  
  // After sending response, initiate outbound call to UK agent
  setTimeout(() => {
    initiateAgentCall(logger, conferenceId, payload);
  }, 1000);
});

async function initiateAgentCall(logger, conferenceId, originalPayload) {
  try {
    const url = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls`;
    
    const body = {
      application_sid: originalPayload.application_sid,
      to: {
        type: 'phone',
        number: process.env.UK_TRANSFER_NUMBER
      },
      from: originalPayload.from,
      call_hook: {
        url: `${process.env.APP_BASE_URL}/agent-answer?conference=${conferenceId}`,
        method: 'POST'
      },
      timeout: 30
    };
    
    logger.info({url, body}, 'Initiating agent call');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const responseText = await response.text();
    logger.info({status: response.status, body: responseText}, 'Agent call response');
    
    if (!response.ok) {
      throw new Error(`Failed to create call: ${response.status} ${responseText}`);
    }
    
  } catch (error) {
    logger.error({error: error.message}, 'Failed to initiate agent call');
  }
}

module.exports = router;
