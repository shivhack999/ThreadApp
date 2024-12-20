const useragent = require('useragent');

const deviceIdentify = async (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  console.log('Parsed User-Agent:', agent);

  // Explicitly check for known cases
  if (agent.source.includes('PostmanRuntime')) {
    req.device = "Postman";
    console.log("Identified as Postman");
  } else if (agent.family === 'okhttp') {
    req.device = "React Native App";
    console.log("Identified as React Native App");
  } else if (agent.device.family === 'Other') {
    req.device = "Web";
    console.log("Identified as Web");
  } else {
    req.device = "App";
    console.log("Identified as App");
  }
  next();
};

module.exports = deviceIdentify;
