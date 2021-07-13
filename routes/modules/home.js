// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 建立  model /require('./models/restaurant.js')  = mongoose.model('Restaurant', restaurantSchema)
const Restaurant = require('../../models/restaurant.js')

// 準備引入路由模組
// 瀏覽全部餐廳(首頁) 利用db種子資料 故沒先跑 npm run seed會無餐廳資料
router.get('/', (req, res) => {
    Restaurant.find() // 取出 Restaurant model 裡的所有資料
      .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
      .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
      .catch(error => console.log(error))
  })

// 匯出路由器
module.exports = router