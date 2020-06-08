const express = require("express");
const app = express();
const PORT = 8080; //default port
const bodyParser = require("body-parser");
const morgan = require("morgan");
let cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

//===========MODULES IMPORTS DB - FUNCTIONS  ===================
const urlDatabase = require("./dataBase").urlDatabase;
const users = require("./dataBase").users;
const generateRandomString = require("./functions").generateRandomString;
const {getUserByEmail, urlsForUser, checkPassword} = require("./helpers");

//=========== Settings ===================
app.set("view engine", "ejs");
app.set("views", "./views");
app.set("trust proxy", 1); // trust first proxy


//=========== Middlewares ===================
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["coffee is Good !", "for you !"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);


function authRedirect(req, res, next) {
  if (req.session.user_email) {
    next();
  } else {
    res.redirect("/urls_login");
  }
}
function authNotlogged(req, res, next) {
  if (req.session.user_email) {
    next();
  } else {
    const templateVars = {
      urls: urlDatabase,
      email: req.session.user_email,
      id: req.session.user_id,
      message: "User is not logged in - Please call login() and then try again",
    };
    res.render("urls_error", templateVars);
  }
}

//=========== GET ===================

app.get("/", authRedirect, (req, res) => {
  res.redirect("/urls");
});

app.get("/urls",authRedirect, (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id),
    email: req.session.user_email,
    id: req.session.user_id,
    users: req.session.users,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls_register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };
  res.render("urls_register", templateVars);
});

app.get("/urls_login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", authNotlogged, (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };
  res.render("urls_new", templateVars);
});

app.get("/urls_error", authRedirect, (req, res) => {
  res.render("urls_error");
});

app.get("/urls/:id", authNotlogged, (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    message: "",
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", authNotlogged, (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", authNotlogged, (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//=============== POST ===============

app.post("/urls", authNotlogged, (req, res) => {
  const shortGeneratedUrl = generateRandomString();
  let long = { longURL: req.body.longURL, userID: req.session.user_id };
  urlDatabase[shortGeneratedUrl] = long;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", authNotlogged, (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", authNotlogged, (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };
  res.render("urls_show", templateVars);
});

app.post(`/urls_edit/:shortURL`, authNotlogged, (req, res) => {
  let newLongUrl = req.body.edit;
  urlDatabase[req.params.shortURL] = {
    longURL: newLongUrl,
    userID: req.session.user_id,
  };
  res.redirect("/urls");
});

//====== register a new user ==============

app.post(`/urls_register`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let result = getUserByEmail(email, users);
  let valid = result.valid;

  const hashedPassword = bcrypt.hashSync(password, 10);

  let templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };

  if (!email || !password) {
    templateVars.message = "Status Code : 400 - Empty form";
    res.status(400).render("urls_error", templateVars);
  } else if (valid) {
    templateVars.message = "Status Code : 400 - Email exist";
    res.status(400).render("urls_error", templateVars);
  } else {
    const shortGeneratedid = generateRandomString();
    templateVars = {
      id: shortGeneratedid,
      email: email,
      password: hashedPassword,
      urls: urlDatabase,
    };
    req.session.user_id = shortGeneratedid;
    req.session.user_email = email;

    users[shortGeneratedid] = {
      id: shortGeneratedid,
      email: email,
      password: hashedPassword,
    };
    console.log(users)
  }
  res.redirect("/urls");
});

//=========== Login an user and verify identity ============

app.post(`/urls_login`, (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;

  let result = getUserByEmail(email, users);
  let valid = result.valid;
  let keyUser = result.keyUser;

  let templateVars = {
    urls: urlDatabase,
    email: req.session.user_email,
    id: req.session.user_id,
    message: "",
  };
  if (!email || (email === undefined && !loginPassword) || loginPassword === undefined) {
    templateVars.message = "Status Code : 400 - Empty form";
    res.status(400).render("urls_error", templateVars);
  } else if (
    valid === true && checkPassword(loginPassword,users[keyUser].password))

  {
    req.session.user_id = users[keyUser].id;
    req.session.user_email = email;
    templateVars = {
      id: req.session.user_id,
      email: req.session.user_email,
      urls: urlDatabase,
      message: "",
    };
    res.redirect("/urls");
  } else {
    templateVars.message =
      "Status Code : 403 - information does not match our records";
    res.status(403).render("urls_error", templateVars);
  }
});
//============  LOGOUT ====================

app.post(`/urls_logout`, (req, res) => {
  req.session = null;

  res.redirect("/urls_login");
});

//===========listening  the Server  =====================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
