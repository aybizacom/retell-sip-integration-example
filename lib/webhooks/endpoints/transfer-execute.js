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
    const bent = require('bent');
    const post = bent(`${process.env.JAMBONZ_REST_API_URL}`, 'POST', 'json', 201);
    
    const response = await post(`/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls`, {
      application_sid: process.env.JAMBONZ_APPLICATION_SID || originalPayload.application_sid,
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
    }, {
      'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`
    });
    
    logger.info({response}, 'Agent call initiated successfully');
  } catch (error) {
    logger.error({error}, 'Failed to initiate agent call');
  }
}

module.exports = router;
