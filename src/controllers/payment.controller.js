// @ts-nocheck
const Payment = require("../models/payment.model");
const Wallet = require("../models/wallet.model");
const Order = require("../models/order.model");
const mongoose = require('mongoose');

/**
 * Create a new payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPayment = async (req, res) => {
  const { orderId, amount, method } = req.body;
  const userId = req.user._id; 

  if (!orderId || !amount || !method) {
    return res.status(400).send({ message: "Order ID, amount, and payment method are required." });
  }

  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    // If the payment method is Wallet, check if the user has enough balance
    if (method === 'Wallet') {
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet || wallet.balance < amount) {
        return res.status(400).send({ message: "Insufficient wallet balance." });
      }
    }

    // Create the payment
    const payment = new Payment({
      order: orderId,
      user: userId,
      amount,
      method
    });

    // Save the payment
    await payment.save();

    // If payment method is Wallet, update the wallet balance
    if (method === 'Wallet') {
      const wallet = await Wallet.findOne({ user: userId });
      wallet.balance -= amount;
      wallet.transactions.push({
        amount,
        type: 'debit',
        description: `Payment for order ${orderId}`
      });
      await wallet.save();
    }

    // Optionally, you can update the order status here

    return res.status(201).send({ message: "Payment created successfully.", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Get a payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id).populate('order').populate('user');
    if (!payment) {
      return res.status(404).send({ message: "Payment not found." });
    }
    return res.status(200).send(payment);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Get all payments for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPaymentsForUser = async (req, res) => {
  const userId = req.user._id; // Assuming you use authentication middleware to attach user to the request

  try {
    const payments = await Payment.find({ user: userId }).populate('order');
    return res.status(200).send(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

module.exports = {
  createPayment,
  getPaymentById,
  getAllPaymentsForUser
};
