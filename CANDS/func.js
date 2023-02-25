const newsModel = require('../INFO/filedbs')
var userModel = require('./filemws')
const jwt = require('jsonwebtoken')
const { OAuth2Client, UserRefreshClient } = require('google-auth-library')
const client = new OAuth2Client('991435748204-2nqakgjfp3ok2cn6spi86svqgpr9fr9h.apps.googleusercontent.com')

exports.getUserDetails = async (req,res) =>{
    const UserDetails = await userModel.findOne({Email:req.auth.email})
    if(!UserDetails){
        return res.json({error:'Server error'})
    }
    return res.json(UserDetails)
}

exports.getUserByEmail = (req, res, next, id) => {
    console.log("lets get the user by email")
    console.log('ID', id)
    // console.log('reqqUEST',req)
    userModel.findById(id).exec((err, user) => {
        if (err || !user) {
            console.log("error is here 1", err)
            return res.status(400).json({
                error: "No user found in Db"
            })
        }
        console.log('user', user)
        console.log("hui hii")
        req.profile = user;
        next()
    })
}

exports.getUserEmail = async (req, res) => {
    try {
        var User = await userModel.findOne({ Email: req.query.userEmail }).exec()
        const { Email, Reference, FDMarket } = User
        const News = await newsModel.find({ Adder: req.query.userEmail })
        if(News === null){
            return res.json({ message: { Email, Reference, FDMarket } })
        }
        const Headline = News.map((index,element) => {
            return index.Headline
        })
        const comments = await newsModel.find()
        const Comments = comments.map((index,element) => {
            return index.Comments
        })
        const CommentsFiltered = [... new Set(Comments.flat())]
        console.log(CommentsFiltered)
        const FinalComments = CommentsFiltered.filter((index,element) => {
            return index.commentedby === req.query.userEmail
        })
        const CommentsbyUser = FinalComments.map((index,element) => {
            return index.commentdesc
        }) 
        return res.json({ message: { Email, Reference, FDMarket, Headline, CommentsbyUser } })
    } catch (er) {
        return res.json({ error: '' })
    }
}
exports.getAllUsers = (req, res) => {
    userModel.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({ Message: 'No users found' })
        }
        userNames = users.map(value => value.Email);
        res.status(200).json(users)
    })
}
// 
exports.updateUser = (req, res) => {
    userModel.findByIdAndUpdate({ _id: req.profile._id },
        { $set: req.body }
        ,
        {
            new: true,
            useFindAndModify: false
        }, (
            err, user
        ) => {
        if (err) {
            return res.status(400).json({ message: "Update unsucessfull" })
        }
        console.log("json data", req.body)
        res.json(user)
    })
}

exports.googlesignin = (req, res) => {
    const tokenId = req.body.tokenId;
    client.verifyIdToken({ idToken: tokenId, audience: '991435748204-2nqakgjfp3ok2cn6spi86svqgpr9fr9h.apps.googleusercontent.com' }
    ).then(response => {
        console.log('response pa', response.payload)
        const email_verfied = response.payload.email_verified
        const email = response.payload.email
        console.log('email', email_verfied)
        if (email_verfied) {
            console.log('email is verified')
            userModel.findOne({ Email: email }).exec((err, user) => {
                if (err) {
                    console.log('email is verified and error came here')
                    return res.status(400).json({ error: 'something went wrong' })
                }
                else {
                    if (user) {
                        console.log('email is verified and user is found')
                        const Token = jwt.sign(
                            {
                                email: response.payload.email, _id: user._id
                            }
                            , process.env.SECRET)
                        res.cookie("UserLoggedIN", Token);
                        const { _id, Email, Password, Role, FDMarket, Phone, Reference } = user
                        return res.json({ Token, user: { _id, Email, Password, Role, FDMarket, Phone, Reference } })
                    }
                    else {
                        console.log('email is verified and user is not found')
                        const record_new = new userModel({
                            Email: email,
                            Password: email + process.env.SECRET,
                            Role: 1,
                            Reference: "Google account",
                            FDMarket: response.payload.locale,
                            Phone: 'xxxxxxxxxx',
                        })
                        record_new.save();
                        const token = createToken(req.body.email);
                        console.log(token);
                        res.cookie("user", token, {
                            httpOnly: true
                        })
                        return res.json({ record_new });
                    }
                }
            })
        }
    })
}


const createToken = async (id) => {
    const x = jwt.sign({ id: id }, process.env.SECRET)
    return x;
}