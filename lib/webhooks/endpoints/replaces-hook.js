const router = require('express').Router();

// This hook is called AFTER the agent answers the outbound call.
// Its job is to issue the final Replaces command to the original customer's call.
router.post('/', async (req, res) => {
  const { logger } = req.app.locals;
  const { original_call_sid } = req.query;
  const agentCallPayload = req.body;
  logger.info({ agentCallPayload, original_call_sid }, '/replaces-hook triggered');

  // We must immediately return an empty 200 OK to this webhook
  res.sendStatus(200);

  try {
    // Construct the "Replaces" parameter from the agent's answered call
    const replaces = encodeURIComponent(
      `${agentCallPayload.sip_callid};to-tag=${agentCallPayload.sip_to_tag};from-tag=${agentCallPayload.sip_from_tag}`
    );

    const referTo = `<sip:${agentCallPayload.to}@${process.env.BRIGHTSTAR_SIP_HOST}?Replaces=${replaces}>`;

    // Use the Jambonz REST API to update the ORIGINAL customer's call leg
    const jambonzUrl = `${process.env.JAMBONZ_REST_API_URL}/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls/${original_call_sid}`;
    
    const response = await fetch(jambonzUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.JAMBONZ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        call_hook: {
          url: `${process.env.APP_BASE_URL}/hangup-hook`, // A simple hook to hangup after transfer
          method: 'POST',
        },
        sip_headers: {
          'Refer-To': referTo
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update call: ${response.status} ${errorText}`);
    }
    
    logger.info({ status: response.status }, 'Call update with Replaces command sent successfully.');

  } catch (err) {
    logger.error({ err }, 'Error sending Replaces command');
  }
});

module.exports = router;
