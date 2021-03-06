const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/User")
const uploader = require("../config/cloudinary")
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") })
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
)

router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
})

router.post("/signup", uploader.single("photo"), (req, res, next) => {
  const { username, password, role } = req.body
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    let newUser
    if (req.file) {
      newUser = new User({
        username,
        password: hashPass,
        photo: req.file.path || null,
        role
      })
    } else {
      newUser = new User({
        username,
        password: hashPass,
        role
      })
    }

    newUser
      .save()
      .then(() => {
        res.redirect("/")
      })
      .catch(err => {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong" })
      })
  })
})

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

//=======SOCIAL=======
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  })
)

module.exports = router
