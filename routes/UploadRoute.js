const path=require('path');
const express = require('express');
const router = express.Router();
const multer  = require('multer')
const {protect,admin}=require('../middleware/authMiddleware');

const storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/');
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file,cb){
    const filetypes=/jpg|jpeg|png/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype){
        return cb(null,true);
    }else{
        cb('Images onnly|');
    }
}

const upload=multer({
    storage,
});

router.post('/',upload.single('image'),(req,res)=>{
    res.send({
        message:'Image Uploaded',
        image: `/${req.file.path.replace(/\\+/g, '/')}`,
    })
});

module.exports = router;