const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurartRawData = require('../../restaurant.json')
const restaurantList = restaurartRawData.results
const db = require('../../config/mongoose')
const seedUsers = [
    {
        name: 'user1',
        email: 'user1@example.com',
        password: '12345678',
        restaurantsId: [1, 2, 3]
    },
    {
        name: 'user2',
        email: 'user2@example.com',
        password: '12345678',
        restaurantsId: [4, 5, 6]
    }
]

db.once('open', () => {
    Promise.all(Array.from(seedUsers, seedUser =>
        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(seedUser.password, salt))
            .then(hash => User.create({
                name: seedUser.name,
                email: seedUser.email,
                password: hash
            }))
            .then(dbUser => {
                const restaurants = restaurantList.filter(restaurant => seedUser.restaurantsId.includes(restaurant.id))
                restaurants.forEach(restaurant => { restaurant.userId = dbUser._id })
                return Restaurant.create(restaurants)
            })
    ))
        .then(() => {
            console.log('seeder done.')
            process.exit()
        })
        .catch(error => console.log(error))
})