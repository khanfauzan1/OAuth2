const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const app = express();
require("./auth.js");

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
//
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session())
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
//
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.send(`Something went wrong`);
});
app.get("/auth/protected", isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send(`Hello ${name}!`);
});
app.use('/auth/logout',(req,res)=>{
    req.session.destroy();
    res.send("See you again")
})
port=process.env.PORT || 5000
app.listen(port, () => {
  console.log("listening on 5000");
});
