const express = require("express");
const app = express();
const PORT = 8080; //default port

const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");

//===========MODULES IMPORTS DB - FUNCTIONS  ===================
const urlDatabase = require('./dataBase').urlDatabase;
const users = require('./dataBase').users;
const generateRandomString = require('./functions').generateRandomString;
const getUserByEmail = require('./helpers').getUserByEmail;
const getUserByEmailPassword = require('./helpers').getUserByEmailPassword;


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
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

  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id ,id: undefined  };
  res.render("urls_index", templateVars);
});

app.get("/urls_register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id,id: undefined  };
  res.render("urls_register", templateVars);
});

app.get("/urls_login", (req, res) => {

  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: req.cookies.id,id: undefined };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id,id: undefined };
  res.render("urls_new", templateVars);
});

app.get("/urls/id", (req, res) => {
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id ,id: undefined};
  res.render("urls_new", templateVars);
});

// add object with a key[shortURL] and key value LongURL { shortURL: LongURL} inside html
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
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
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id ,id: undefined};
  res.redirect(`/urls/${req.params.shortURL}`,templateVars);
});

app.post(`/urls_edit/:shortURL`, (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.edit;
  console.log(req.params.shortURL);
  console.log(req.body);
  const templateVars = { urlDatabase, username: undefined, password: null, email: req.cookies.id ,id: undefined};
  res.redirect(`/urls`,templateVars);
});

//=========================
// register a new user and verify if email exist

app.post(`/urls_register`, (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  // let valid;
  
  let templateVars;
  let statusCode;

  if(email === "" || password === ""){
    statusCode = `Status Code : 200 - Empty form`;

    res.send("<html><body> <h1><b>Status Code : 200 - Empty form</b> </h1></body></html>\n");
    // res.send(`${statusCode}`);
  }

  // search if email and if it exist valid true
  // for(const emailID in users) {
  //   if(users[emailID].email === req.body.email) 
  //     {     
  //     valid = true;
  //     break;
  //   }
  // }
let result = getUserByEmail(email, users);
let valid = result.valid;

  if(valid) {
    statusCode = `Status Code : 400 - Email exist`;
    res.send("<html><body> <h1><b>Status Code : 400 - Email exist</b> </h1></body></html>\n"); 
    // res.send(`${statusCode}`);
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
  let id;
  let templateVars;
  let statusCode;

// validate de email & password
// for(const key in users) {
//   if(users[key].email === req.body.email && users[key].password === req.body.password) 
//     {     
//     user = users[key];
//     valid = true;
//     break;
//   }
// }

// const result = getUserByEmailPassword(email, users, password);
// user = result.user;
// valid = result.valid;

let result = getUserByEmailPassword(email, users, password);
let valid = result.valid;
let keyUser = result.keyUser;

if(valid) 
{
  templateVars = 
  {
    id: users[keyUser].id,
    email: email,
    password: password,
    urls: urlDatabase
  }
  console.log(templateVars);
    res.cookie("id", templateVars.email);
    res.render(`urls_index`,templateVars);
} 
 else
 {
  statusCode = `Status Code : 403 - Information does not match`;
  res.send("<html><body> <h1><b>Status Code : 403 - information does not match our records</b> </h1></body></html>\n"); 
  // res.send(`${statusCode}`);
 }
  
});
//============  LOGOUT ====================

app.post(`/urls_logout`, (req, res) => {
  
  res.clearCookie("id");
  const templateVars = { urls: urlDatabase, username: undefined, password: null, email: undefined ,id: undefined};
  res.render("urls_index", templateVars);
});

//================================






