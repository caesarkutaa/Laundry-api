const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LaundryItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Shirt', 'Pants', 'Dress', 'Suit', 'Other'],
    required: true
  },      
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('LaundryItem', LaundryItemSchema);
