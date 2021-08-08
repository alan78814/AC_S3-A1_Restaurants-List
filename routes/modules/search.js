const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//搜尋特定餐廳資料 
router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const userId = req.user._id
  Restaurant.find({ userId })
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

module.exports = router