const { urlDatabase, users } = require("./dataBase");
const bcrypt = require("bcrypt");

const urlsForUser = function (userId) {
  const userUrls = {};
  
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userId) {
      
      userUrls[url] = urlDatabase[url];
    }
  }return userUrls;

};

const checkPassword = (loginPassword, hashedPassword) => {
  if (bcrypt.compareSync(loginPassword, hashedPassword)) {
    return true;
  }
  return false;
};

const getUserByEmail = function (email, dataBase) {
  let emailUser;
  let keyUser;
  for (const key in dataBase) {
    if (dataBase[key].email === email) {
      emailUser = dataBase[key].email;
      valid = true;
      keyUser = key;
      break;
    } else {
      valid = false;
    }
  }
  result = { valid, keyUser, emailUser };

  return result;
};

module.exports = { getUserByEmail, urlsForUser , checkPassword};
