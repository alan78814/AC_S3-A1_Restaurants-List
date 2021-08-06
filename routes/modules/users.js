const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

// 首先載入 passport，然後更新「登入檢查」，用 Passport 提供的 authenticate 方法執行認證。
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {

    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ email })
        .then(user => {
            if (user) {
                console.log('User already exists.')
                res.render('register', {
                    name,
                    email,
                    password,
                    confirmPassword
                })
            } else {
                return User.create({
                    name,
                    email,
                    password
                })
                    .then(() => res.redirect('/'))
                    // then(res.redirect('/')) 也可
                    .catch(err => console.log(err))
            }
        })
})

router.get('/logout', (req, res) => {
    // Passport.js 提供的函式，會清除 session。
    req.logout()
    res.redirect('/users/login')
})

module.exports = router