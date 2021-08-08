const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
    // exports 1 個 function，接受一參數 app
    // 初始化 Passport 模組
    app.use(passport.initialize())
    app.use(passport.session())
    // 設定本地登入策略
    // 多傳了參數 { usernameField: 'email' }，把驗證項目從預設的 username 改成 email，AC課程有官方連結。
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: '此Email尚未註冊' })
                }
                // user.password 是 db 雜湊過後的密碼
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, { message: '登入密碼錯誤' })
                    }
                    return done(null, user)
                })
            })
            .catch(err => done(err, false))
    }))
    // 設定 FacebookStrategy
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email })
            .then(user => {
                if (user) return done(null, user) // 有的話直接將user丟回去
                // 沒有的話 產生資料存入db
                const randomPassword = Math.random().toString(36).slice(-8)
                bcrypt
                    .genSalt(10)
                    .then(salt => bcrypt.hash(randomPassword, salt))
                    .then(hash => User.create({
                        name,
                        email,
                        password: hash
                    }))
                    .then(user => done(null, user))
                    .catch(err => done(err, false))
            })
    }))
    // 序列化 (serialize)，如果登入驗證通過，就把 user id 放進 session。
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    // 反序列化 (deserialize)，用 user id 去資料庫裡查出完整的 user 實例。
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}