const express = require('express');
const router = express.Router();
const orderController = require("../controllers/order.contoller");


router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrderById);
router.delete('/orders/:id', orderController.deleteOrderById);

module.exports = router;
        