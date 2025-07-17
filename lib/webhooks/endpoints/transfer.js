const router = require('express').Router();

router.post('/', async (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  
  logger.info({payload}, 'transfer webhook received');
  
  if (payload.function_call && payload.function_call.name === 'transfer_to_uk_agent') {
    logger.info('🔄 TRANSFER DETECTED! Using Jambonz REST API...');
    
    // Just return success to Retell - we'll handle transfer separately
    res.json({ status: 'transfer_initiated' });
    
    // TODO: Need to implement Jambonz REST API call here
    // For now, just log the attempt
    logger.info('Transfer attempt logged - need Jambonz credentials');
    return;
  }
  
  res.sendStatus(200);
});

module.exports = router;
