const mongoose = require('mongoose')

const userScheama = mongoose.Schema({
    userName: {
        type: String,
        required: [true, "please add contact first name"]
    }, 
    pays: {
        type: String,
    }, 
    ville: {
        type: String,
    }, 
    address: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "please add contact first name"]
    },
    email: {
        type: String,
        required: [true, "please add contact first name"],
        unique: [true, "Email all ready taken"]
    },
    profil_id: {
        type: Number,
        default: 1,
        required: [true],
    },
    active_user: {
        type: Boolean,
        default: true,
        required: [true],
    }
})

module.exports = mongoose.model('User', userScheama)