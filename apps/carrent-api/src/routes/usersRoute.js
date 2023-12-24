const express = require('express')
const {userReisters, resetPassword, userActivation, userLogin, currentUser, updateUser, DesactivateOrDeleteCompte} = require('../controllers/usersController')
const validateAccesToken = require('../middleware/validateAccessToken')
const route = express.Router()

route.get('/', (req, res) => {
    res.status(200).json({Message: 'Get users'})
})

route.post('/register', userReisters)
route.use('/update/:id', validateAccesToken, updateUser)
route.post('/login', userLogin)
route.delete('/:id', validateAccesToken, DesactivateOrDeleteCompte)
route.post('/userActivation', validateAccesToken, userActivation)
route.post('/resetPassword', validateAccesToken, resetPassword)
route.get('/login/:id', validateAccesToken, currentUser)


module.exports = route
