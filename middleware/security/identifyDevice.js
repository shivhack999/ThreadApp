const useragent = require('useragent');

const deviceIdentify = async (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  // Explicitly check for known cases
  if (agent.source.includes('PostmanRuntime')) {
    req.device = "Web";
  } else if (agent.family === 'okhttp') {
    req.device = "App"
  } else if (agent.device.family === 'Other') {
    req.device = "Web";
  } else {
    req.device = "App";
  }
  next();
};

module.exports = deviceIdentify;