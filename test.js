// const validation = function (email , password) {
//   let foundEmail;

//   for (const emailID in users) {
//     if(users[emailID].email === email && users[emailID].password === password) {
//       foundEmail = email;
//       foundId = users[emailID].id;
       

//     }
//   }
// }

app.post(`/urls_login`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(req.body);
  let foundEmail;
  let foundId;
  let templateVars;
  // search if email exist
  for (const emailID in users) {
    if (
      users[emailID].email === email &&
      users[emailID].password === password
    ) {
      foundEmail = users[emailID].email;
      console.log(foundEmail);
      foundId = users[emailID].id;
      console.log(foundId);
      templateVars = {
        email: foundEmail,
        id: foundId,
        userLog: true
        // page: "index"
      };

    }
    
     
  }
  // if(foundEmail)
  // {

  //   res.render(`/urls_index`, templateVars);
  // } else 
   if(email === undefined)
    {
    templateVars = {
      error: "not a valid informations"
      // page: "login"
    };
    res.send(`a = ${a}`);
    
  }
  
  res.cookie("rememberme", foundId);
  templateVars.urls = urlDatabase;
  templateVars.userLog = templateVars.userLog || false;
  templateVars.email = templateVars.email || null;
  templateVars.id = templateVars.id || null;
  // templateVars.page = templateVars.page || null;

  res.render(`/urls_index`,templateVars);
});

app.post(`/urls_logout`, (req, res) => {
  console.log(req.body.email);

  res.clearCookie("rememberme");
  let templateVars = {
    email: undefined,
    id: urlDatabase
  };

  res.render("urls_index", templateVars);
});


///=============== bueno post register

app.post(`/urls_register`, (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  let valid;
  let message;
  let templateVars;
  let statusCode;

  if(email === "" || password === ""){
    statusCode = `Status Code : 200 `;
    
    res.send(`${statusCode}`);
  }

  // search if email exist
  for(const emailID in users) {
    if(users[emailID].email ===req.body.email) 
      {
      
      valid = true;
      break;

    }
  }
  if(valid) {
    message = "Congrats you are login! : "
    templateVars = {
      
      email: email,
      password: password,
      urls: urlDatabase
    }
    res.render(`urls_login`,templateVars);
    // res.send(`a = ${message},${email}`);  
  } else {
    // users.user4RandomID.id = "user4RandomID",
    // users.user4RandomID.email = email,
    // users.user4RandomID.password = password,
    message = "ok"

    templateVars = {
      id: "user4RandomID",
      email: email,
      password: password,
      urls: urlDatabase
    
    };
    res.cookie("id", templateVars.email);

    // templateVars.urls = urlDatabase;
    // templateVars.password = templateVars.userLog || null;
    // templateVars.email = templateVars.email || null;
    // templateVars.id = templateVars.id || null;

    
  }
  res.render(`urls_index`,templateVars);
});