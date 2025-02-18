const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const User = require('../models/User');
const JWT_SECRET = 'Mishal!190106'
// ROute 1 : Create a User using POst /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });  // ✅ Stops execution after sending response
    }

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
    }
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt); // ✅ Await the hash function
    try {
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        return res.json({authToken});
    } catch (err) {
        return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
    }
});


//Authenticate a user using Login /api/auth/login

// router.post('/createuser', [
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Enter the password ').exists(),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });  // ✅ Stops execution after sending response
//     }
//     const{email,password} = req.body;
//     try {
//         let user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
//         }
//         if(user.password !== password){
//             return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
//         }
//         return res.json(user); // ✅ Stops execution after sending response
//     } catch (err) {
//         return res.status(400).json({ error: 'Email already exists' }); // ✅ Only runs if error occurs
//     }
   

// })


module.exports = router