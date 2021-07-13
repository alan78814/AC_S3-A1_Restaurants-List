const Restaurant = require('../restaurant') // 載入 restaurant.js
const rawData = require('../../restaurant.json')
const seedData = rawData.results

const db = require('../../config/mongoose')
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
        //.then 執行 db.close()：執行 npm run seed 後自動從終端機上退出
        .then(() => {
            db.close()
        })
    })
    console.log('restaurant seeder done')
})