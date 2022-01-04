const express = require('express');
const passport = require('passport');
const db = require('../db');
const aux = require('../helper');
const createError = require('http-errors');

const router = express.Router();

// {baseURL}/ClearSettlement
router.get('/:ID',
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if given settlement ID is valid
            if (!aux.validate_settlementID(req.params.ID)) {
                throw new createError(400, 'Invalid request parameter (settlement ID)');
            }

            // Get path parameter
            const id = req.params.ID;

            // Check if user can access resource. This resource can be accessed
            // by any payment user and any admin user
            if (!['payment', 'admin'].includes(req.user.type)) {
                throw new createError(401);
            }

            // Check if requested settlement exists
            const sql_check = `SELECT * FROM settlement WHERE ID = ?`;
            const [check] = await db.execute(sql_check, [id]);
            if (check.length === 0) {
                throw new createError(402, 'No settlement found with requested ID');
            }

            // Mark requested settlement as cleared
            const sql_main = `UPDATE settlement SET cleared = 1 WHERE ID = ?`;
            await db.execute(sql_main, [id]);

            res.status(200).send();
        } catch (err) {
            next(err);
        }
    }
)

module.exports = router;