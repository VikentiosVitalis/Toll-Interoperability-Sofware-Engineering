const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = require('../misc/jwt-secret');

router.post('/login', 
    express.urlencoded({ extended: false }), 
    passport.authenticate('local', { session: false }), 
    async function(req, res, next) {
        try {
            const token = jwt.sign(
                {
                    username: req.user.username,
                    type: req.user.type,
                    operatorID: req.user.operatorID
                }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );
            res.status(200).send({ token: token });
        } catch (err) {
            next(err);
        }
    }
);

router.post('/logout', 
    passport.authenticate('jwt', { session: false }), 
    function (req, res) {
        res.status(200).send();
    }
);

module.exports = router;