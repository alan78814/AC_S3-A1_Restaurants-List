const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

// 點擊排序選擇
router.post('/sort', (req, res) => {
  const name = req.body.sort
  const sortCondition = {
    asc: { name_en: 'asc' },
    desc: { name_en: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' },
    rating: { rating: 'desc' }
  }
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(sortCondition[name])
    .then(restaurants => res.render('index', { restaurants, name }))
    .catch(error => console.log(error))
})

// 瀏覽全部餐廳(首頁)
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = router
