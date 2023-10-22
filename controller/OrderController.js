const asycHandler =require('../middleware/asyncHandler')
const Order=require('../model/orderModel');

const { ObjectId } = require('mongodb');

//crate order post and prive api/orders

exports.addOrderItems=asycHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }=req.body;

  if(orderItems && orderItems.length===0){
    res.status(400);
    throw new Error('No order Item')
  }
  else{
    const order=new Order({
      orderItems:orderItems.map((x)=>({
        ...x,
        product:x._id,
        _id:undefined
      })),
      user:req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder=await order.save()
    res.status(201).json(createdOrder);
  }
});

// get logged in user order and get and private api/orders/myorders
exports.getMyOrders=asycHandler(async (req, res) => {
    const orders=await Order.find({user:req.user._id});
    res.json(orders)

    
  });

//get order by api/orders/:id
exports.getOrderById=asycHandler(async (req, res) => {
  const order=await Order.findById(req.params.id).populate(
    'user','name email');
  if(order){
    res.status(200).json(order)
  }else{
    res.status(404)
    throw new Error('Order not found')
  } 
  });

//update order and private and get api/orders/:id/pay
exports.updateOrderToPaid=asycHandler(async (req, res) => {
    const order=await Order.findById(req.params.id);
    if(order){
      order.isPaid=true;
      order.paidAt=Date.now();
      order.paymentResult={
        id:req.body.id,
        status:req.body.status,
        update_time:req.body.update_time,
        email_address:req.body.payer.email_address,
      };
      const updatedOrder=await order.save();
      res.status(200).json(updatedOrder);
    }
    else{
      res.status(404);
      throw new Error('Order Not Found');
    }
  });

//update to deliver and private/admin and get api/orders/:id/deliver
exports.updateOrderToDelivered=asycHandler(async (req, res) => {
    const order=await Order.findById(req.params.id);

    if(order){
      order.isDelivered=true;
      order.deliveredAt=Date.now();
      const updatedOrder=await order.save()
      res.status(200).json(updatedOrder)
    }else{
      res.status(404)
      throw new Error('Order not found')
    }
  });

//get all order and prive/admin api/orders

exports.getAllOrders=asycHandler(async (req, res) => {
    const orders=await Order.find({}).populate('user','id name');
    res.status(200).json(orders);
  });