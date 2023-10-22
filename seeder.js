const mongoose = require('mongoose');
const dotenv=require('dotenv');
const users=require('./data/user');
const products=require('./data/products');
const User =require('./model/userModel');
const Product=require('./model/productModel');
const Order=require('./model/orderModel');
const connectDB=require('./config/db')

dotenv.config();
connectDB();

const importData=async()=>{
    try{
        
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers=await User.insertMany(users);
        const adminUser=createdUsers[0]._id;
        const sampleProducts=products.map((product)=>{
            return{...product,user:adminUser};
        })
        await Product.insertMany(sampleProducts);
        console.log('Data imported')
        process.exit()
    }catch(error){
        console.error(`error is ${error}`)
        process.exit(1);
    }
}

const destoryData=async()=>{
    try{
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed')
        process.exit()
    }catch(error){
        console.error(`error is ${error}`)
        process.exit(1);
    }
}

if(process.argv[2]==='-d'){
    destoryData();
}else{
    importData();
}