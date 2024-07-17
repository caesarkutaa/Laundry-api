const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Wallet schema
const walletSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
   },
  balance: { 
    type: Number, 
    default: 0 
   },
  transactions: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['credit', 'debit'], required: true },
      date: { type: Date, default: Date.now },
      description: { type: String }
    }
  ]
}, { timestamps: true });

// Create the Wallet model
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
