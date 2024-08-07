function hexToString(hex) {
    const hexStr = hex.toString();
    let str = '';
    for (let i = 0; i < hexStr.length; i += 2) {
      str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
    }
    return str;
  }
  
  module.exports = { hexToString };
  