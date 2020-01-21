const express = require("express");
const app = express();
const PORT = 8080; //default port

app.set("view engine", "ejs");

// // get a web page on path url/hello (in html)
// app.get("/hello", (req, res) => {
//   res.send("<html><body> Hello <b>World</b></body></html>\n");
// });


//===========get  ejs ===================

// add route /urls & pass data with res.render
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World'};
  res.render('hello_world', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// app.get("/urls/:shortURL/delete", (req, res) => {
//   res.render("/urls/:shortURL/delete");
// });

app.get("/urls/id", (req, res) => {
  res.render("urls_new");
});

// add object with a key[shortURL] and key value LongURL { shortURL: LongURL} inside html
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


// app.get("/urls/:id", (req, res) => {
//   res.render("urls_new");
// });

//================GET==============

// get a web with a "hello" in body
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/set", (req, res) => {
  const a =1;
  res.send(`a = ${a}`);
})
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  console.log(req.params);
  res.redirect(longURL);
});


//=============== POST ===============

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  const shortGeneratedUrl = generateRandomString()
  urlDatabase[shortGeneratedUrl] = req.body.longURL
  res.redirect('urls/'+shortGeneratedUrl)
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  
  res.redirect('/urls')
})

// send to edit page when request to edit
app.post('/urls/:shortURL/edit', (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`)
})

app.post(`/urls_edit/:shortURL`, (req, res) => {
  // urlDatabase[req.params.shortURL] = {
  //   shortURL: req.params.shortURL = req.body.longURL
  // }
  urlDatabase[req.params.shortURL] = req.body.edit;
  console.log(req.params.shortURL)
  console.log(req.body)

  res.redirect(`/urls`)
})


//================================


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let randomStr = Math.random().toString(36).substring(7);
  return randomStr;
}

