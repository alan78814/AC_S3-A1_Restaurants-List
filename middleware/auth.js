module.exports = {
    // 設定檔匯出一個物件，物件裡是一個叫做 authenticator 的函式。
    // req.isAuthenticated() 是 Passport.js 提供的函式，會根據 request 的登入狀態回傳 true 或 false。
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    }
}

// 可改寫成如下 
// index.js引入改為 const authenticator = require('../middleware/auth')
// module.exports =
//     function authenticator(req, res, next) {
//         if (req.isAuthenticated()) {
//             return next()
//         }
//         res.redirect('/users/login')
//     }


