const fs = require("fs");
const crypto =  require('crypto');



function getIntegrityCode(filePath) {
    const contentText = fs.readFileSync(filePath);
    const digest = crypto
      .createHash('sha512')
      .update(contentText, 'utf8')
      .digest();
    
    const calculatedIntegrity = digest.toString('base64');
    return `sha512-${calculatedIntegrity}`;
}

module.exports = {
    getIntegrityCode
}

