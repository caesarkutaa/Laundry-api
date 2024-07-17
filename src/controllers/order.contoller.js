// @ts-nocheck
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;
  const userId = req.user._id; 
  
  if (!items ) {
    return res.status(400).send({ message: 'Items are required.' });
  }

  try {
    const order = new Order({
      user: userId,
      items,
      totalPrice,
    });

    await order.save();
    return res.status(201).send({ message: 'Order created successfully.', order });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error.' });
  }
};

/**
 * Retrieve all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.laundryItem').populate('user', 'firstname lastname email');
    return res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error.' });
  }
};

/**
 * Retrieve a single order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('items.laundryItem').populate('user', 'firstname lastname email');
    if (!order) {
      return res.status(404).send({ message: 'Order not found.' });
    }
    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error.' });
  }
};

/**
 * Update an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found.' });
    }

    order.status = status || order.status;

    await order.save();
    return res.status(200).send({ message: 'Order updated successfully.', order });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error.' });
  }
};

/**
 * Delete an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found.' });
    }

    await order.remove();
    return res.status(200).send({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Server error.' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById
};
