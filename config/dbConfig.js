const mongoose = require('mongoose')

const connexionDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
    } catch (error) {
        process.exit(1)
    }
}

module.exports = connexionDB