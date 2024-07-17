const { Router } = require("express");
const router = Router();

const { createUser,
    loginUser,
    updateUser,
    deleteUser,
   verifyUser,
   forgetpassword,
   emailRestpassword,
   restUserpassword
} =require("../controllers/user.controller")


router.post("/register",createUser)
router.post("/login",loginUser)
router.put("/:id",updateUser)
router.delete("/:id",deleteUser)
router.get("/verify/:id", verifyUser);
router.post("/forgetpassword", forgetpassword);
router.get("/emailreset-password/:id",emailRestpassword );
router.post("/reset-password/:userId", restUserpassword);



module.exports = router