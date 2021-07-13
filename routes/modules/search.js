// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//搜尋特定餐廳資料 先找出db所有資料 搜尋出符合元素可能有多筆於index渲染 
router.get('/', (req, res) => {
    //使用trim()避免關鍵字含空格
    const keyword = req.query.keyword.trim().toLowerCase()
    Restaurant.find()
      .lean()
      .then((restaurants) => {
        restaurants = restaurants.filter((restaurant) => 
          restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)  
        )
        
        if (restaurants.length === 0) {
          res.render('index', { restaurants: restaurants, keyword: keyword, alert: `<h1 class="display-5 mt-5 text-info text-center">搜尋無結果 請重新輸入關鍵字</h1>` })
        } else {
          res.render('index', { restaurants: restaurants, keyword: keyword }) 
        }
    })
})


// 匯出路由器
module.exports = router