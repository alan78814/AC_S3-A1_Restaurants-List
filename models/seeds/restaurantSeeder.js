const Restaurant = require('../restaurant') // 載入 restaurant.js
const rawData = require('../../restaurant.json')
const seedData = rawData.results

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
    seedData.forEach((restaurant) => {
        Restaurant.create({
            id: restaurant.id,
            name: restaurant.name,
            name_en: restaurant.name_en,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description
        })
    })
    console.log('mongodb connected!')
})