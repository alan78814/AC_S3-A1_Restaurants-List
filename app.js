// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
// require express-handlebars here 固定使用語法格式
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
// 建立  model /require('./models/restaurant.js')  = mongoose.model('Restaurant', restaurantSchema)
const Restaurant = require('./models/restaurant.js')
// 載入 method-override
const methodOverride = require('method-override')
// 引用路由器
const routes = require('./routes')

// 載入 mongoose.js
require('./config/mongoose')
// setting template engine 固定使用語法格式
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({ extended: true })) //改寫成 express
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 將 request 導入路由器
app.use(routes)
// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
// setting static files
app.use(express.static('public'))

