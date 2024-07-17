const Wallet = require("../models/wallet.model");
const User = require("../models/user.model");


const createWalletForUser = async (userId) => {
  try {
    // Check if the user already has a wallet
    const existingWallet = await Wallet.findOne({ user: userId });
    if (existingWallet) {
      return existingWallet; // Return the existing wallet if found
    }

    // Create and save a new wallet for the user
    const newWallet = Wallet.create({ user: userId });

    return newWallet;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating a wallet for the user");
  }
};


module.exports={
    createWalletForUser
}