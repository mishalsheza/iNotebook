const express = require('express');
const router = express.Router();
const { body,query, validationResult } = require('express-validator');


const User = require('../models/User');

//Create a User using POst /api/auth
router.post('/', [
    body('name', 'Enter a valid Name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });  // ✅ Stops execution after sending response
    }

    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        return res.json(user); // ✅ Stops execution after sending response
    } catch (err) {
        return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
    }
});


module.exports = router