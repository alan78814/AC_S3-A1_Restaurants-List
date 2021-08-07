// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 建立  model /require('./models/restaurant.js')  = mongoose.model('Restaurant', restaurantSchema)
const Restaurant = require('../../models/restaurant.js')

// 路由語義化 不變
//新增餐廳的表單頁 (須放在'/restaurants/:restaurant_id'前面)
router.get('/new', (req, res) => {
    return res.render('new')
})


// 路由語義化 不變
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
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})

// 路由語義化 不變
//瀏覽特定餐廳，只需顯示單一元素於show渲染 使用find
router.get('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        // 找 db 符合_id的項目
        .lean()
        .then((restaurants) => res.render('show', { restaurants }))
        .catch(error => console.log(error))
})

// 路由語義化 不變
//修改餐廳的表單頁，點擊edit
router.get('/:id/edit', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        // 找 db 符合_id的項目
        .lean()
        .then((restaurants) => res.render('edit', { restaurants }))
        .catch(error => console.log(error))
})

// 路由語義化 POST->PUT
//修改一筆餐廳資料，edit頁面編輯完送出 (做完要到edit.hbs更改路由{{restaurants._id}})
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

// 路由語義化 POST->delete
//刪除一筆餐廳資料
router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Restaurant.findOne({ _id, userId })
        .then(restaurants => restaurants.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router