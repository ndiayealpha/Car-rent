/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
const connexionDB = require('../../../config/dbConfig.js')
const errorHandler = require('./middleware/errorHandler.js')
const validateAccesToken = require('./middleware/validateAccessToken.js')
const app = express();
app.use(express.json())
connexionDB()
app.use('/api/users', require('./routes/usersRoute') );
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(errorHandler)

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
});
server.on('error', console.error);
