if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const http = require("http");
const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

const bcrypt = require("bcrypt");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
// Importing file-store module
const filestore = require("session-file-store")(session)
const initializePassport = require("./passport-config");

/*Practice Async Function*/
// function resolveAfter2Seconds(x) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(x);
//     }, 2000);
//   });
// }

// async function expression assigned to a variable
// const add = async function (x) {
//   const a = await resolveAfter2Seconds(20);
//   const b = await resolveAfter2Seconds(30);
//   return x + a + b;
// };

// add(10).then((v) => {
//   console.log(v); // prints 60 after 4 seconds.
// });

// async function expression used as an IIFE
// (async function (x) {
//   const p1 = resolveAfter2Seconds(20);
//   const p2 = resolveAfter2Seconds(30);
//   return x + (await p1) + (await p2);
// })(10).then((v) => {
//   console.log(v); // prints 60 after 2 seconds.
// });
/*Practice Async Function*/





initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

  // const bodyParser = require("body-parser");
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(express.compress());
  // app.use(express.bodyParser());
  //app.use(express.cookieParser());

  // Creating session 
app.use(session({
    name: "session-id",
    secret: "GFGEnter", // Secret key,
    saveUninitialized: false,
    resave: false,
    store: new filestore()
}));


app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Main Page [ http://localhost:3000 ]

app.get("/", checkAuth, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

// Login Page [ http://localhost:3000/login ]

app.get("/login", checkNotAuth, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuth,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Registration Page [ http://localhost:3000/register ]

app.get("/register", checkNotAuth, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuth, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //const hashedPassword = await bcrypt.encrypt(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

// Logout if Logged in

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// Middlewares

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Server

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
