const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route Post api/user
// @desc Register user 
// @access public

router.post('/', [
    check('name', 'User name is required')
        .not()
        .isEmpty(),
    check('email', 'User email is required')
        .isEmail(),
    check('password', 'User password is required')
        .isLength({ min: 6 })
],
    async (req, res) => {
        // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            // see if user exists 
            const { name, email, password } = req.body;

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ message: 'User already exists' }] });
            }

            // Get users gravatar

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mp'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // encrypt password

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
                (err, token) => {
                    if (err) throw err;
                    console.log("token = ", token);
                    res.json({ token });

                }
            )



            res.send("User Registered successfully");

        } catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');
        }





    });

module.exports = router;