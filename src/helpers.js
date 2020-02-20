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
       break;
       }else {
         valid = false;
       }
       keyUser = key;
       
     }
      result = {valid , keyUser , emailUser};
  
      return result;
  }


const getUserByEmailPassword = function(email,dataBase,password) 
{
  let keyUser;
  for(const key in dataBase) 
  {
   if(dataBase[key].email === email && dataBase[key].password === password) 
    {
       valid = true;
       break;
     }else {
       valid = false;
     }
     keyUser = key;
     emailUser = dataBase[key].email;
   }
    result = {valid , keyUser , emailUser};

    return result;
}


module.exports = {getUserByEmail, getUserByEmailPassword};