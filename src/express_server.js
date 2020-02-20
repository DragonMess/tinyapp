const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const morgan = require('morgan');
let cookieParser = require("cookie-parser");

//===========MODULES IMPORTS DB - FUNCTIONS  ===================
const urlDatabase = require("./dataBase").urlDatabase;
const users = require("./dataBase").users;
const generateRandomString = require("./functions").generateRandomString;
const getUserByEmail = require("./helpers").getUserByEmail;
const getUserByEmailPassword = require("./helpers").getUserByEmailPassword;

//=========== Settings ===================
app.set("view engine", "ejs");

//=========== Middlewares ===================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
//=========== GET ===================

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: req.cookies.id
  };
  res.render("urls_index", templateVars);
});

app.get("/urls_register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: undefined
  };
  res.render("urls_register", templateVars);
});

app.get("/urls_login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: undefined
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: req.cookies.id
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/id", (req, res) => {
  const templateVars = {
    urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: undefined
  };
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
  console.log(req.params);
  res.redirect(longURL);
});

//=============Learning GET==============
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
//=============== POST ===============

app.post("/urls", (req, res) => {
  const shortGeneratedUrl = generateRandomString();
  let long = {longURL:req.body.longURL, userID:req.cookies.id};
  
  urlDatabase[shortGeneratedUrl] = long;
  console.log(req.body.longURL);
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: req.cookies.id
  }
  res.render("urls_index" ,templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: undefined
  }
  res.redirect("/urls",templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(req.params.shortURL);
  const templateVars = {
    urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: undefined,
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL
  };
  res.render('urls_show', templateVars);
});

app.post(`/urls_edit/:shortURL`, (req, res) => {
  let newLongUrl = req.body.edit;
  urlDatabase[req.params.shortURL] = {longURL: newLongUrl, userID:req.cookies.id};
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: req.cookies.email,
    id: req.cookies.id
  };
  res.render(`urls_index`, templateVars);
});

//====== register a new user ==============

app.post(`/urls_register`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let result = getUserByEmail(email, users);
  let valid = result.valid;
  let templateVars;

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
      password: password,
      urls: urlDatabase
    };

    res.cookie("email", templateVars.email);
    res.cookie("id", templateVars.id);
  }
  res.render(`urls_index`, templateVars);
});

//=========== Login an user and verify identity ============
app.post(`/urls_login`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;
  let id;
  let templateVars;
  let result = getUserByEmailPassword(email, users, password);
  let valid = result.valid;
  let keyUser = result.keyUser;

  if (valid) {
    templateVars = {
      id: users[keyUser].id,
      email: email,
      password: password,
      urls: urlDatabase
    };
    res.cookie("email", templateVars.email);
    res.cookie("id", templateVars.id);
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
  res.clearCookie("id");
  const templateVars = {
    urls: urlDatabase,
    username: undefined,
    password: null,
    email: undefined,
    id: undefined
  };
  res.render("urls_index", templateVars);
});

//===========listening  the Server  =====================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});