const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
var path = require('path')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const PORT = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser());
const ProductModel = require('./PRODUCT/productsDB')
const formidable = require('formidable')
const _ = require('lodash')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
// 
app.use(express.static("public"));
app.use(express.json());
const corsOptions = {
    origin: '*',
}
app.use(cors(corsOptions))
const fs = require('fs')
const { resolveSrv } = require('dns')
// mongodb+srv://tarunsinha968:<password>@cluster0.qagmwmn.mongodb.net/?retryWrites=true&w=majority
const conn = 'mongodb+srv://' + process.env.USNAME + ':' + process.env.PASSWORD + '@cluster0.qagmwmn.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(conn,
    { useNewUrlParser: true, useUnifiedTopology: true })
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json({extended:false}))
// app.use(bodyParser.json({extended:true}))
// import { getShopbyID } from './AREAS/FUNC'
// const abc = require('./AREAS/func')
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const Auths = require('./CANDS/fileroutes')
const { googlesignin } = require('./CANDS/func.js')
const { getAllshopBycountry,
    getAllImages, SubmitLocation, SubmitLocationsImage,
    getImageOne, getPhotoofImage, getShopOwnerById,getShopbyID } = require('./AREAS/func.js')
const { userPurchaseList } = require('./ORDER/func.js')
const { getAllOrderstoAdmin, getAorder,
    getStatus,updateStatus } = require('./ORDER/aggorders.js')
const { isAuthenticated, isAdmin, isSignedIn } = require('./METHODS/auth')

const { getUserByEmail, getAllUsers, updateUser, 
    getUserEmail, getUserDetails } = require('./CANDS/func')
const { AddingNews, NewsComment, getNewsbyId,
    SubmitFormNews, getAllnews, getPhotoNews, getNewstoFront } = require('./INFO/func')
const { SubmitForm, UpdateForm } = require('./PRODUCT/form')
const { FindbyName, FindbyAdder, FindbyID, FindbyRating, FindAll } = require('./PRODUCT/agg')
const { createOrder, pushOrderInPurchaseList, updateStock, orderinit, orderverify, getOrderById } = require('./ORDER/func.js')
const { getProductbyId } = require('./PRODUCT/func')
const { Feedback, RatingCalc, getPhoto, productDelete } = require('./PRODUCT/func')







app.param("adder", getUserByEmail)
app.param("news", getNewsbyId)
app.param("image", getImageOne)
app.param("shopowner", getShopOwnerById)
app.param("product", getProductbyId)
app.param("location", getShopbyID)
app.param("ordersp", getOrderById)

app.post('/googlesignin', googlesignin)
app.get('/users/:adder', isSignedIn, isAuthenticated, isAdmin, getAllUsers)
app.put('/users/update/:adder', isSignedIn, isAuthenticated, updateUser)
app.get('/Order/users/:adder', isSignedIn, isAuthenticated, userPurchaseList)
app.get('/Order/:adder/one/:ordersp', isSignedIn, isAuthenticated, getAorder)
app.post('/feedback/:product/:adder', isSignedIn, isAuthenticated, Feedback, RatingCalc)

app.get("/order/status/admin/:adder", isSignedIn,isAuthenticated,getStatus)
app.put("/update/status/admin/:adder", isSignedIn,isAuthenticated,updateStatus)


app.post("/update-product/:product/item/:adder", isSignedIn, isAuthenticated, isAdmin, UpdateForm)
app.get("/All-Products/:adder", isSignedIn, isAuthenticated, isAdmin, FindAll)
app.get("/Products/", FindAll)
app.get("/Photo/:product", getPhoto)
app.get("/Orders/admin/:adder", isSignedIn, isAuthenticated, isAdmin, getAllOrderstoAdmin)
app.get("/News/:news", getNewstoFront)
app.post("/comment/:adder/:news",
    isSignedIn,
    isAuthenticated,
    NewsComment)
app.post("/add-news/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitFormNews)
app.get("/all-news", getAllnews)
app.get("/user/:adder", isSignedIn, isAuthenticated, getUserDetails)
app.get("/PhotoNews/:news", getPhotoNews)
app.get("/productsbyName", FindbyName)
app.get("/productsbyID", FindbyID)

app.delete("/product/:product/:adder", isSignedIn, isAuthenticated, isAdmin, productDelete)
app.get("/Image/:shopowner/photo/:image", getPhotoofImage)
app.get("/productsbyAdder", FindbyAdder)
app.get("/user/profile", getUserEmail)
app.get("/productsbyRating", FindbyRating)
app.get("/shopsbycountry", getAllshopBycountry)
app.get("/all-images/:adder", isSignedIn, isAuthenticated, getAllImages)
app.post("/add-product/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitForm)


app.post("/payment/:adder/product", isSignedIn, isAuthenticated, orderinit)
app.post("/verify/:adder", isSignedIn, isAuthenticated, orderverify)
app.post("/order-purchase/:adder", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)


app.post("/add-shop/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitLocation)
app.post("/update-shop/:location/by/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitLocationsImage)
app.use("/", Auths)
app.listen(PORT, () => {
    console.log("On the port 5000")
})