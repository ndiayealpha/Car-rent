const jwt = require('jsonwebtoken')
const assyncHandler = require('express-async-handler')
const validateAccesToken = assyncHandler(async (req, res, next) => {
    let token;
    let autHeader = req.headers.Authorization || req.headers.authorization;
    if (autHeader && autHeader.startsWith('bearer')) {
        token = autHeader.split(" ", 2)[1]
        jwt.verify(token, process.env.ENCRYPTION_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error('Forbiden Acces')
            }
            req.user = decoded.user
            next()
        })
        if (!token) {
            res.status(401);
            throw new Error('Forbiden Acces')
        }
    } else {
        res.status(401);
        throw new Error('Forbiden Acces')
    }
    
})

module.exports = validateAccesToken