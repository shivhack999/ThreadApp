const fs = require('fs').promises;
const path = require('path');
const removeImage = async(imgName, path) =>{
    const imagePath = path.join(__dirname, path, imgName);
    try {
        const unlinkResponse = await fs.unlink(imagePath);
        if(unlinkResponse) return true;
        return false
  } catch (error) {
    console.log(error)
    return false;
  }
}

module.exports = removeImage;