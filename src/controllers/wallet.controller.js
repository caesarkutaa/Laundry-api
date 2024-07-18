// @ts-nocheck
const Wallet = require("../models/wallet.model");

/**
 * Create a new wallet for a user
 * @param {ObjectId} userId - The ID of the user
 */
const createWallet = async (userId) => {
    try {
        const wallet = new Wallet({ user: userId });
        await wallet.save();
        return wallet;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to create wallet');
    }
};

/**
 * Add a transaction to a wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addTransaction = async (req, res) => {
    const { userId, amount, type, description } = req.body;

    if (!userId || !amount || !type) {
        return res.status(400).send({ message: "User ID, amount, and type are required." });
    }

    if (!['credit', 'debit'].includes(type)) {
        return res.status(400).send({ message: "Invalid transaction type." });
    }

    try {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found." });
        }

        const transaction = { amount, type, description };

        wallet.transactions.push(transaction);

        if (type === 'credit') {
            wallet.balance += amount;
        } else if (type === 'debit') {
            wallet.balance -= amount;
        }

        await wallet.save();
        return res.status(200).send({ message: "Transaction added successfully.", wallet });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error." });
    }
};

/**
 * Get a wallet by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWalletByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found." });
        }

        return res.status(200).send(wallet);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error." });
    }
};

/**
 * Get all transactions for a wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found." });
        }

        return res.status(200).send(wallet.transactions);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error." });
    }
};

module.exports = {
    createWallet,
    addTransaction,
    getWalletByUserId,
    getAllTransactions
};
