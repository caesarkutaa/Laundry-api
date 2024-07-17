// @ts-nocheck
const LaundryItem = require("../models/laundry.model");

/**
 * Create a new laundry item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createLaundryItem = async (req, res) => {
  const { category, quantity, description } = req.body;
  const userId = req.user._id;

  if (!category || !quantity) {
    return res.status(400).send({ message: "Category and quantity are required." });
  }

  try {
    const laundryItem = new LaundryItem({
      user: userId,
      category,
      quantity,
      description
    });

    await laundryItem.save();
    return res.status(201).send({ message: "Laundry item created successfully.", laundryItem });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Retrieve all laundry items for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllLaundryItems = async (req, res) => {
  const userId = req.user._id;

  try {
    const laundryItems = await LaundryItem.find({ user: userId });
    return res.status(200).send(laundryItems);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Retrieve a single laundry item by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLaundryItemById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const laundryItem = await LaundryItem.findOne({ _id: id, user: userId });
    if (!laundryItem) {
      return res.status(404).send({ message: "Laundry item not found." });
    }
    return res.status(200).send(laundryItem);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Update a laundry item by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateLaundryItemById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { category, quantity, description } = req.body;

  try {
    const laundryItem = await LaundryItem.findOne({ _id: id, user: userId });
    if (!laundryItem) {
      return res.status(404).send({ message: "Laundry item not found." });
    }

    laundryItem.category = category || laundryItem.category;
    laundryItem.quantity = quantity || laundryItem.quantity;
    laundryItem.description = description || laundryItem.description;

    await laundryItem.save();
    return res.status(200).send({ message: "Laundry item updated successfully.", laundryItem });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

/**
 * Delete a laundry item by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteLaundryItemById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const laundryItem = await LaundryItem.findOne({ _id: id, user: userId });
    if (!laundryItem) {
      return res.status(404).send({ message: "Laundry item not found." });
    }

    await laundryItem.remove();
    return res.status(200).send({ message: "Laundry item deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

module.exports = {
  createLaundryItem,
  getAllLaundryItems,
  getLaundryItemById,
  updateLaundryItemById,
  deleteLaundryItemById
};
