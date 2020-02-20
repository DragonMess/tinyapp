function generateRandomString() {
    let randomStr = Math.random()
      .toString(36)
      .substring(7);
    return randomStr;
  }

  module.exports = {generateRandomString};