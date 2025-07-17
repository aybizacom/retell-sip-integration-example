const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const conferenceId = req.query.conference;
  
  logger.info({conferenceId}, 'Agent answered - joining conference');
  
  res.json([
    {
      verb: 'say',
      text: 'Connecting you now.'
    },
    {
      verb: 'conference',
      name: conferenceId,
      beep: false,
      endConferenceOnExit: true
    }
  ]);
});

module.exports = router;
