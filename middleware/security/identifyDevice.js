const useragent = require('useragent');

const deviceIdentify = async (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  console.log('Parsed User-Agent:', agent);

  if (agent.device.family === 'Other') {
    req.device = "Web";
    console.log("Identified as Web");
  } else {
    req.device = "App";
    console.log("Identified as App");
  }

  next();
};

module.exports = deviceIdentify;
