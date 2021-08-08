const express = require('express')
const router = express.Router()

const passport = require('passport')

// 點擊 facebook登入按鈕
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// Facebook 把資料發回來
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router
