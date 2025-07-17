logger.info(`Making request to: ${jambonzUrl}`);
logger.info(`Request body:`, JSON.stringify({
  call_hook: {
    url: `${process.env.APP_BASE_URL}/transfer-execute`,
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
      url: `${process.env.APP_BASE_URL}/transfer-execute`,
      method: 'POST'
    }
  })
});

logger.info(`Response status: ${response.status}`);
logger.info(`Response body: ${await response.text()}`);
