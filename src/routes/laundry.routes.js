const express = require("express");
const router = express.Router();
const laundryItemController = require("../controllers/laundry.controller");


router.post("/items", laundryItemController.createLaundryItem);
router.get("/items", laundryItemController.getAllLaundryItems);
router.get("/items/:id", laundryItemController.getLaundryItemById);
router.put("/items/:id", laundryItemController.updateLaundryItemById);
router.delete("/items/:id", laundryItemController.deleteLaundryItemById);


module.exports = router;

