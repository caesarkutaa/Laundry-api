const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LaundryItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Shirt', 'Pants', 'Dress', 'Suit', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('LaundryItem', LaundryItemSchema);
