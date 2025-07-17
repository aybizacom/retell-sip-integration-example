const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.info('Conference wait hook - playing music');
  
  res.json([
    {
      verb: 'play',
      url: 'https://www.jambonz.org/audio/jambonz-hold.mp3',
      loop: true
    }
  ]);
});

module.exports = router;
