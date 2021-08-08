const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//新增餐廳的表單頁 (須放在'/restaurants/:restaurant_id'前面)
router.get('/new', (req, res) => {
    return res.render('new')
})

//新增一筆餐廳。
router.post('/', (req, res) => {
    const name = req.body.name
    const name_en = req.body.name_en
    const category = req.body.category
    const image = req.body.image
    const location = req.body.location
    const phone = req.body.phone
    const google_map = req.body.google_map
    const rating = req.body.rating
    const description = req.body.description
    const userId = req.user._id
    return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

//瀏覽特定餐廳，只需顯示單一元素於show渲染，使用find
router.get('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        .lean()
        .then((restaurants) => res.render('show', { restaurants }))
        .catch(error => console.log(error))
})

//修改餐廳的表單頁，點擊edit
router.get('/:id/edit', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        .lean()
        .then((restaurants) => res.render('edit', { restaurants }))
        .catch(error => console.log(error))
})

//修改一筆餐廳資料，edit頁面編輯完送出
router.put('/:id', (req, res) => {
    const name = req.body.name
    const name_en = req.body.name_en
    const category = req.body.category
    const image = req.body.image
    const location = req.body.location
    const phone = req.body.phone
    const google_map = req.body.google_map
    const rating = req.body.rating
    const description = req.body.description
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        .then(restaurants => {
            restaurants.name = name
            restaurants.name_en = name_en
            restaurants.category = category
            restaurants.image = image
            restaurants.location = location
            restaurants.phone = phone
            restaurants.google_map = google_map
            restaurants.rating = rating
            restaurants.description = description
            return restaurants.save()
        })
        .then(() => res.redirect(`/restaurants/${_id}`))
        .catch(error => console.log(error))
})

//刪除一筆餐廳資料
router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        .then(restaurants => restaurants.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router