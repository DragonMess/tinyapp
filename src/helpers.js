const users = require('./dataBase').users;

const getUserByEmail = function(email, dataBase)
{
    let emailUser;
    let keyUser;
    for(const key in dataBase) 
    {
     if(dataBase[key].email === email) 
      {
        emailUser = dataBase[key].email
        valid = true;
        keyUser = key;
       break;
       }else {
         valid = false;
       }
       
       
     }
      result = {valid , keyUser , emailUser};
  
      return result;
  }

module.exports = {getUserByEmail};