const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({
    path: 'variables.env'
});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// middleware
server.express.use(cookieParser());

server.express.use(function(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId;
    }
    
    next();
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    },
    deets => {
        console.log(`Server is running on port ${deets.port}`);
    }
);