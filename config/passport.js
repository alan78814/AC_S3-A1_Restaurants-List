const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, { message: 'Email or Password incorrect.' })
                    }
                    return done(null, user)
                })
            })
            .catch(err => done(err, false))
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