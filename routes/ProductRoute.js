const express = require('express');
const router = express.Router();

const {getAllproducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProduct
} = require('../controller/ProductController');


const {protect,admin}=require('../middleware/authMiddleware');

router.route('/').get(getAllproducts).post(protect,admin,createProduct);
router.route('/top').get(getTopProduct);
router.route('/:id').get(getSingleProduct)
.put(protect,admin,updateProduct)
.delete(protect,admin,deleteProduct);
router.route('/:id/reviews').post(protect,createProductReview);

module.exports = router;

