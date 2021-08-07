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
    // 在 new LocalStractegy 的時候，多傳了第一個參數 { usernameField: 'email' }，把驗證項目從預設的 username 改成 email，AC課程有官方連結。
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered!' })
                }
                // user.password 是 db 雜湊過後的密碼
                // https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E5%BF%83%E5%BE%97-%E8%AA%8D%E8%AD%98%E5%90%8C%E6%AD%A5%E8%88%87%E9%9D%9E%E5%90%8C%E6%AD%A5-callback-promise-async-await-640ea491ea64
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, { message: 'Email or Password incorrect.' })
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
    // 設定序列化與反序列化
    // 如果登入驗證通過，就把 user id 放進 session，這是序列化 (serialize)。
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    // 如果要用到完整的 user 資料，就會呼叫反序列化 (deserialize)，用 user id 去資料庫裡查出完整的 user 實例。
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}