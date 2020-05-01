const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route Get api/auth
// @access public

router.get('/', auth, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (err) {
        console.log(err.msg);
        res.status(500).send("Server Error");
    }

})







// @route Post api/auth
// @desc Login user
// @access public

router.post('/', [
    check('email', 'User email is required')
        .isEmail(),
    check('password', 'password is required')
        .exists()
],
    async (req, res) => {
        // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            // see if user exists 
            const { email, password } = req.body;

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ message: 'Invalid crendential' }] });
            }



            // decrypt password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ message: 'Invalid crendential' }] });

            }




            // return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token, res) => {
                    if (err) throw err;
                    console.log("token = ", token);
                    res.json({ token });

                }
            )



            res.send("Login Successful");

        } catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');
        }





    })









module.exports = router;