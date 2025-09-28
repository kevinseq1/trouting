const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Replace with a secret from .env for prod
const SECRET = process.env.JWT_SECRET

/**
 * Middleware to verify JWT tokens.
 * - Checks "Authorization: Bearer <token>" header
 * - Verifies the token
 * - Attaches user info to req.user
 * - Calls next() if valid, otherwise return 401
 */

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token required' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: `Invalid Token`});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
