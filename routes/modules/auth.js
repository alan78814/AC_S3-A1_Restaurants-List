const express = require('express')
const router = express.Router()

const passport = require('passport')

// 點擊 facebook登入按鈕
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}))

// facebook 放回我們瀏覽器
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

module.exports = router