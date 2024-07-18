const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');


router.post('/wallets', walletController.createWallet);
router.post('/wallets/transaction', walletController.addTransaction);
router.get('/wallets/:userId', walletController.getWalletByUserId);
router.get('/wallets/:userId/transactions', walletController.getAllTransactions);

module.exports = router;
