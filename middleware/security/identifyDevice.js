const useragent = require('useragent');
const deviceIdentify = async(req, res, next) =>{
  const agent = useragent.parse(req.headers['user-agent']);
    if (agent.device.family === 'Other') {
        req.device = "Web";
        console.log("web")
    } else {
        req.device = "App";
        console.log("App")
    }
  next();
}
module.exports = deviceIdentify;