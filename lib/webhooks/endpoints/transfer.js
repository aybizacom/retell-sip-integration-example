const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info('=== TRANSFER ENDPOINT HIT ===');
  logger.info({payload}, 'Full payload received');
  
  // Log specific fields we're looking for
  logger.info('function_call:', payload.function_call);
  logger.info('call_id:', payload.call_id);
  logger.info('call_sid:', payload.call_sid);
  
  if (payload.function_call) {
    logger.info('Function call name:', payload.function_call.name);
    
    if (payload.function_call.name === 'transfer_to_uk_agent') {
      logger.info('🔄 TRANSFER DETECTED! Using Jambonz REST API...');
      
      // Just return success for now - let's see if we get here
      return res.json({ status: 'transfer_detected' });
    } else {
      logger.info('Function name does not match. Expected: transfer_to_uk_agent, Got:', payload.function_call.name);
    }
  } else {
    logger.info('No function_call found in payload');
  }
  
  logger.info('=== END TRANSFER ENDPOINT ===');
  res.sendStatus(200);
});

module.exports = router;
