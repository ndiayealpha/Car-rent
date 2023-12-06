const express = require('express')
const {userReisters, resetPassword, userLogin, currentUser} = require('../controllers/usersController')
const validateAccesToken = require('../middleware/validateAccessToken')
const route = express.Router()

route.get('/', (req, res) => {
    res.status(200).json({Message: 'Get users'})
})

route.post('/register', userReisters)
route.post('/login', userLogin)
route.post('resetPassword', validateAccesToken, resetPassword)
route.get('/login/:id', validateAccesToken, currentUser)


module.exports = route
