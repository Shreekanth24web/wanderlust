const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const warpAsync = require('../utils/warpAsync')
const passport = require('passport')
const { saveRediredUrl } = require('../middleware.js')
const usersController = require('../controllers/users.js')

//signUp
router
    .route('/signup')
    .get( usersController.renderSingupForm)
    .post(  warpAsync(usersController.signUp))

//login
router
    .route('/login')
    .get(usersController.renderLoginForm)
    .post(
        saveRediredUrl,
        passport.authenticate("local", {
            failureRedirect: '/login', failureFlash: true
        }),
        usersController.login)

//logout
router.get('/logout', usersController.logout)

module.exports = router