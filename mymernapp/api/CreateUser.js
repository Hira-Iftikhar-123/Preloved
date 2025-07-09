const express = require('express');
require('dotenv').config();
const router = express.Router();
const User = require('../utils/models/User');
const dbConnect = require('../utils/dbConnect');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

router.post("/createuser",
    body('email').isEmail(),body('password','Incorrect Password Length').isLength({min:5}),
    body('name').isLength({min:5}),
    async(req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
         return res.status(400).json({errors:errors.array()});  
        }

    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password,salt)
 

    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass,
            location: req.body.location
        });
        res.json({success:true});
    }
    catch(error) {
        console.log(error)
        res.json({success:false});
    }
})

router.post("/loginuser", 
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").isLength({min : 5}), async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); 
        return res.status(400).json({ errors: errors.array() })
    }

    let email = req.body.email;
    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            console.log('User not found:', email); 
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        if (userData.isAdmin) {
            return res.status(403).json({ error: "Please use the admin login page to log in as admin." });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        
        const data = { id: userData.id }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken: authToken, email: userData.email})
    } catch (error) {
        console.error('Login error:', error.message)
        res.send("Server Error")
    }
})

module.exports = router;