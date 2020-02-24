const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const morgan = require('morgan');
let cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

//===========MODULES IMPORTS DB - FUNCTIONS  ===================
const urlDatabase = require("./dataBase").urlDatabase;
const users = require("./dataBase").users;
const generateRandomString = require("./functions").generateRandomString;
const getUserByEmail = require("./helpers").getUserByEmail;
const templateVars = {
  urls: urlDatabase,
  username: undefined,
  password: null,
  email:'' ,
  id: undefined,
  message:''
};
//=========== Settings ===================
app.set("view engine", "ejs");

//=========== Middlewares ===================
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['coffee is Good !','for you !'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//=========== GET ===================

app.get("/urls", (req, res) => {
  templateVars.email = req.session.user_email;
  res.render("urls_index", templateVars);
});

app.get("/urls_register", (req, res) => {
  templateVars.email = req.session.user_email;
  res.render("urls_register", templateVars);
});


app.get("/urls_login", (req, res) => {
  templateVars.email = req.session.user_email;
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  templateVars.email = req.session.user_email;
  templateVars.id = req.session.user_id;
  res.render("urls_new", templateVars);
});

app.get("/urls/id", (req, res) => {
  templateVars.email = req.session.user_email;
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//=============== POST ===============

app.post("/urls", (req, res) => {
  const shortGeneratedUrl = generateRandomString();
  let long = {longURL:req.body.longURL, userID:req.session.user_id};
  urlDatabase[shortGeneratedUrl] = long;
  templateVars.email = req.session.user_email;
  templateVars.id = req.session.user_id;
  res.render("urls_index" ,templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  templateVars.email = req.session.user_email;
  res.render(`urls_index`, templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  templateVars.email = req.session.user_email;
  templateVars.shortURL = req.params.shortURL;
  templateVars.longURL = req.params.longURL;
  templateVars.id = req.session.user_id;

  res.render('urls_show', templateVars);
});

app.post(`/urls_edit/:shortURL`, (req, res) => {
  let newLongUrl = req.body.edit;
  urlDatabase[req.params.shortURL] = {longURL: newLongUrl, userID:req.session.user_id};
  templateVars.email = req.session.user_email;
  templateVars.id = req.session.user_id;

  res.render(`urls_index`, templateVars);
});

//====== register a new user ==============

app.post(`/urls_register`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let result = getUserByEmail(email, users);
  let valid = result.valid;
  let templateVars;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || (email === "" && !password) || password === "") {
    res
      .status(400)
      .send(
        "<html><body> <h1><b>Status Code : 400 - Empty form</b> </h1></body></html>\n"
      );
  } else if (valid) {
    res
      .status(400)
      .send(
        "<html><body> <h1><b>Status Code : 400 - Email exist</b> </h1></body></html>\n"
      );
  } else {
    const shortGeneratedid = generateRandomString();
    templateVars = {
      id: shortGeneratedid,
      email: email,
      password: hashedPassword,
      urls: urlDatabase
    };
    req.session.user_id = shortGeneratedid;
    req.session.user_email = email;
  }
  res.render(`urls_index`, templateVars);
});

//=========== Login an user and verify identity ============

app.post(`/urls_login`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let templateVars;
  let result = getUserByEmail(email, users);
  let valid = result.valid;
  let keyUser = result.keyUser;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || email === undefined && !password || password === undefined) {
    res
      .status(400)
      .send(
        "<html><body> <h1><b>Status Code : 400 - Empty form</b> </h1></body></html>\n"
      );
  } 
  else if (valid === true &&  bcrypt.compareSync(users[keyUser].password, hashedPassword)) {
    templateVars = {
      id: users[keyUser].id,
      email: email,
      password: password,
      urls: urlDatabase,
      message:''
    };
    req.session.user_id = users[keyUser].id;
    req.session.user_email = email;
    res.render(`urls_index`, templateVars);
  } else {
    res
      .status(403)
      .send(
        "<html><body> <h1><b>Status Code : 403 - information does not match our records</b> </h1></body></html>\n"
      );
  }
});
//============  LOGOUT ====================

app.post(`/urls_logout`, (req, res) => {
  req.session = null;
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: undefined,
    id: undefined
  };
  res.render('urls_register',templateVars);
});


//===========listening  the Server  =====================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
