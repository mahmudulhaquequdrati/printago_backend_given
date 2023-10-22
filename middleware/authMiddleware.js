const jwt=require('jsonwebtoken');
const asycHandler =require('../middleware/asyncHandler');
const Userdata=require('../model/userModel');

//protect routes
const protect=asycHandler(async(req,res,next)=>{
    let token;
    //read jwt form cookies
    token=req.cookies.jwt;
    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await Userdata.findById(decoded.userId).select('-password');
            next();
        }catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not authorized ,token failed');

        } 
        
    }else{
        res.status(401);
        throw new Error('Not authorized ,no token');
    }

})


//admin middleware
const admin=(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized as admin');
    }
}

module.exports={protect,admin};