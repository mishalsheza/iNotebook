const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const User = require('../models/User');
const JWT_SECRET = 'Mishal!190106';

// Route 1: Create a User using POST /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Stops execution after sending response
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: 'Email already exists' }); // Only runs if error occurs
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt); //  Await the hash function

    try {
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
        });

        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        return res.json({ authToken });
    } catch (err) {
        return res.status(400).json({ error: 'Email already exists' }); //  Only runs if error occurs
    }
});

// Route 2: Authenticate a user using POST /api/auth/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter the password ').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Stops execution after sending response
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' }); //  Corrected error message
        }

        const isMatch = await bcrypt.compare(password, user.password); // Await the hash function
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' }); //  Corrected error message
        }

        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        return res.json({ authToken });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Server error' }); //  Added generic server error handling
    }
});

// Route 3: Get LoggedIn user details POST /api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        return res.send(user);
    
} catch (error) {
    console.log(err.message);
    return res.status(500).json({ error: 'Server error' }); //  Added generic server error handling
    
}
})


module.exports = router;
