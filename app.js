// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here 固定使用語法格式
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

//載入mongoose
const mongoose = require('mongoose')
// 設定連線到 mongoDB 連線到restaurant-list資料夾
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true }) 
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine 固定使用語法格式
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// routes setting
app.get('/', (req, res) => {
  // create a variable to store resturant
  res.render('index', { restaurants: restaurantList.results })
})

//只需顯示單一元素於show渲染 使用find
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

//搜尋出符合元素可能有多筆於index渲染 使用filter回傳一新陣列
app.get('/search', (req, res) => {
  //使用trim()避免關鍵字含空格
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => 
    restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
  )
  
  if (restaurants.length === 0) {
    res.render('index', { restaurants: restaurants, keyword: keyword, alert: `<h1 class="display-5 mt-5 text-info text-center">搜尋無結果 請重新輸入關鍵字</h1>` })
  } else {
    res.render('index', { restaurants: restaurants, keyword: keyword }) 
  }
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

// setting static files
app.use(express.static('public'))

