const mongoose =require('mongoose')
const initData = require('./data.js') 
const listing = require('../models/listing.js')

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

mongoose.connect(MONGO_URL)
.then(()=>{console.log("Database Connected...")})
.catch((err)=>{console.log("Database Error ",err)})

const initDB = async() =>{
    await listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj, owner:"6807a39d1adbe5e162247bd2"}))
    await listing.insertMany(initData.data)
    console.log("data was initialized")
}
initDB()