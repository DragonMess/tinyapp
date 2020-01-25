const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// // get a web page on path url/hello (in html)
// app.get("/hello", (req, res) => {
//   res.send("<html><body> Hello <b>World</b></body></html>\n");
// });

//===========get  ejs ===================

// add route /urls & pass data with res.render and object templateVars
// pass the value of cookie to other pages with req.cookies.id
app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id };
  res.render("urls_index", templateVars);
});

app.get("/urls_register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id  };
  res.render("urls_register", templateVars);
});

app.get("/urls_login", (req, res) => {

  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id };
  res.render("urls_new", templateVars);
});

app.get("/urls/id", (req, res) => {
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id };
  res.render("urls_new", templateVars);
});

// add object with a key[shortURL] and key value LongURL { shortURL: LongURL} inside html
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL], username: undefined, password: null, email: req.cookies.id
  };
  res.render("urls_show", templateVars);
});


//================GET==============

// get a web with a "hello" in body
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(req.params);
  res.redirect(longURL);
});

//=============== POST ===============

app.post("/urls", (req, res) => {
  const shortGeneratedUrl = generateRandomString();
  urlDatabase[shortGeneratedUrl] = req.body.longURL;
  res.redirect("urls/" + shortGeneratedUrl);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];

  res.redirect("/urls");
});

// send to edit page when request to edit
app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post(`/urls_edit/:shortURL`, (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.edit;
  console.log(req.params.shortURL);
  console.log(req.body);

  res.redirect(`/urls`);
});

//=========================
// register a new user and verify if email exist

app.post(`/urls_register`, (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  let valid;
  
  let templateVars;
  let statusCode;

  if(email === "" && password === ""){
    statusCode = `Status Code : 200 - Empty form`;
    
    res.send(`${statusCode}`);
  }

  // search if email and if it exist valid true
  for(const emailID in users) {
    if(users[emailID].email === req.body.email) 
      {     
      valid = true;
      break;
    }
  }
  if(valid) {
    statusCode = `Status Code : 400 - Email exist`;   
    res.send(`${statusCode}`);
  } else {
     const shortGeneratedid = generateRandomString();
     
     templateVars = {
      id: shortGeneratedid,
      email: email,
      password: password,
      urls: urlDatabase 
    };
    console.log(templateVars);
    res.cookie("id", templateVars.email);

  }
  res.render(`urls_index`, templateVars);
});

// Login an user and verify if email and password are good

app.post(`/urls_login`, (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  let user;
  let valid;
  let templateVars;
  let statusCode;



// validate de email & password
for(const key in users) {
  if(users[key].email === req.body.email && users[key].password === req.body.password) 
    {     
    user = users[key];
    valid = true;
    break;
  }
}
if(valid) 
{
  templateVars = 
  {
    id: user.id,
    email: email,
    password: password,
    urls: urlDatabase 
  }
    res.cookie("id", templateVars.email);
    res.render(`urls_index`,templateVars);
} 
 else
 {
  statusCode = `Status Code : 403 - Information does not match`;   
  res.send(`${statusCode}`);
 }
  

});
//================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let randomStr = Math.random()
    .toString(36)
    .substring(7);
  return randomStr;
}

const users = {
  "userRandomID": {
    "id": "userRandomID",
    "email": "user@example.com",
    "password": "purple-monkey-Dinosaur"
  },
  "user2RandomID": {
    "id": "user2RandomID",
    "email": "user2@example.com",
    "password": "dishwasher-funk"
  },
  "user3RandomID": {
    "id": "user3RandomID",
    "email": "ex@.com",
    "password": "go"
  }
};
