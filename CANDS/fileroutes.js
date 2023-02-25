const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
var userModel = require('./filemws')
const { check, validationResult } = require('express-validator');
router.post('/signin', async (req, res) => {
    try {
        console.log("login me ")
        const record_to_find = await userModel.findOne({
            Email: req.body.email, Password: req.body.password
        })
        console.log(record_to_find, req.body)
        if (!record_to_find) {
            res.json({ error: "No User Was Found" });
        }
        const Token = jwt.sign(
            {
                email: req.body.email, _id: record_to_find._id
            }
            , process.env.SECRET)
        res.cookie("UserLoggedIN", Token);
        const { _id, Email, Password, Role, FDMarket, Phone, Reference } = record_to_find
        return res.json({ Token, user: { _id, Email, Password, Role, FDMarket, Phone, Reference } })

    } catch (error) {
        console.log(error);
        res.json({ Message: "Error, Kindly Login Again" })
    }
})

router.post('/signup',
    [
        check('Phone')
            .isLength({ min: 10, max: 10 }).withMessage('Phone number must contain 10 numbers.')
            .matches(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/).withMessage('Only numbers')
        ,
        check('Reference')
            .matches(/^[A-Za-z\s]+$/).withMessage('Reference must be alphabetic.')
        ,
        check('Password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
            .matches(/\d/).withMessage('Password must contain a number')
        ,
        check('Email').isEmail()
        .withMessage('Email not valid').custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                userModel.findOne({
                    "Email":
                        { $regex: new RegExp("^" + req.body.Email.toLowerCase(), "i") }
                }
                    , function (err, user) {
                        if (err) {
                            reject(new Error("Server Error"));
                        }
                        if (Boolean(user)) {
                            reject(new Error("E-mail already in use"));
                        }
                        resolve(true);
                    });
            });
        }),
    ]
    , async (req, res) => {
        console.log(req.body);

        console.log("====================")
        try {
            const errors = validationResult(req);
            console.log(req.body)
            console.log(errors)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const record_new = await new userModel({
                Email: req.body.Email,
                Password: req.body.Password,
                Role: req.body.Role,
                Reference: "Website",
                FDMarket: req.body.FDMarket,
                Phone: req.body.Phone,
            })
            await record_new.save();
            const token = await createToken(req.body.email);
            console.log(token);
            res.cookie("user", token, {
                httpOnly: true
            })
            return res.json({ record_new });
        }
        catch (err) {
            console.log(err)
            return res.json({ errors: [{ 'msg': "Error in the SiginUp, Kindly Try again later" }] })
        }
    })

router.post('/signout', async (req, res) => {
    console.log('res', res)
    res.clearCookie('UserLoggedIN')
    // res.clearCookie('user')
    res.json({
        Message: "Cookie Cleared"
    })
})
const createToken = async (id) => {
    const x = jwt.sign({ id: id }, process.env.SECRET)
    return x;
}
// 
module.exports = router