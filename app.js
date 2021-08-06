const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant.js')
const methodOverride = require('method-override')
const routes = require('./routes')
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

require('./config/mongoose')

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  // 保留選擇資料
  helpers: {
    checkAsc: function (name) {
      if (name === "asc")
        return "selected"
    },
    checkDesc: function (name) {
      if (name === "desc")
        return "selected"
    },
    checkCategory: function (name) {
      if (name === "category")
        return "selected"
    },
    checkLocation: function (name) {
      if (name === "location")
        return "selected"
    },
    checkRating: function (name) {
      if (name === "rating")
        return "selected"
    },
  }
}))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true })) //改寫成 express
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})


