// @ts-nocheck
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const walletController = require("../controllers/wallet.controller");

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer setup
console.log('AUTH_EMAIL:', process.env.AUTH_EMAIL); // Debugging log
console.log('AUTH_PASSWORD:', process.env.AUTH_PASSWORD); // Debugging log

let transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.log('Error:', err.message); 
    } else {
        console.log("Server is ready to take our messages:", success);
    }
});


// Register user
const createUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(422).send({ message: "Missing required email." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "Email is already in use." });
        }

        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        
        // Create a wallet for the new user
        await walletController.createWallet(user._id);

        // Generate a verification token with the user's ID
        const verificationToken = user.createjwt();
        
        // Email the user a unique verification link
        const url = `localhost:3001/user/verify/${verificationToken}`;
        const emailHtml = `
            <div style="background-color: #f3f3f3; padding: 20px;">
                <h2 style="color: #333; font-size: 24px;">Verify Your Account</h2>
                <p style="color: #555; font-size: 16px;">Click <a href="${url}" style="color: #007BFF; text-decoration: none;">here</a> to confirm your email.</p>
            </div>
        `;

        await transporter.sendMail({
            to: email,
            subject: "Verify Account",
            html: emailHtml,
        });

        return res.status(201).send({
            message: `Sent a verification email to ${email}`,
        });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).send({ message: 'Server error' });
    }
};

module.exports = {
    createUser
};



// login user
const loginUser = async (req, res) => {
    ///checking if the user has email and password
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(403).json("please provide email and password");
    }
    const user = await User.findOne({ email });
    //checking if there is a user
    if (!user) {
      res.status(403).json("Email not Found");  
    }
    ///checking if the user password is correct by using bcrypt.compare
    const ispasswordcorrect = await user.checkpassword(password);
    if (!ispasswordcorrect) {
      res.status(403).json("Invalid Password");
    }
    //Ensure the account has been verified
    // if (!user.verified) {
    //   return res.status(403).send({
    //     message: "Verify your Account.",
    //   });
    // }
  
    //sending the user name and token
    const token = user.createjwt();
    res.status(201).json({ user: { userName: user.firstname,
      userPhoneNumner:user.phoneNumber,
      userEmail:user.email,
       userId:user._id}, token });
  };


  const updateUser = async (req, res) => {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  };


  ///deleting user
const deleteUser = async (req, res) => {
    try {
      const deleteuser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "user has been deleted...." });
    } catch (error) {
      res.status(500).json(error);
    }
  };

//Verify User Email
  const verifyUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // Check we have an id
    if (!id) {
      return res.status(422).send({
        message: "Missing token",
      });
    }
    // Step 1 -  Verify the token from the URL
    let payload = null;
    try {
      payload = jwt.verify(id, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    try {
      // Step 2 - Find user with matching ID
      const user = await User.findOne({ _id: payload.userId });
      console.log(payload.userId);
      if (!user) {
        return res.status(404).send({
          message: "User does not  exists",
        });
      }
      // Step 3 - Update user verification status to true
      await User.findByIdAndUpdate(user, { verified: true }, { new: true });
      const styledMessage = `
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; font-size: 18px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); width: 300px; margin: 0 auto; margin-top: 20px;">
      Account Verified </br>
      Go back to login page
    </div>
  `;
      return res.status(200).send(styledMessage);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };



//forget password
const forgetpassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check for email
      if (!email) {
        return res.status(422).send({ message: "Missing email." });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // Generate reset token
      const resetToken = user.createjwt();
  
      const URL = `localhost:30001/user/reset-password/${resetToken}`;
      console.log(URL);
      transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${URL}">Reset Password</a>`,
      });
      return res.status(201).send({
        message: `Sent a password reset email to ${email}`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
};


//Reset User Password
const emailRestpassword = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(422).send({
        message: "Missing token",
      });
    }
    
    let payload = null;
    try {
      payload = jwt.verify(id, process.env.JWT_SECRET);
      
      const buttonHtml = `
        <html>
        <head>
          <style>
            /* Add your CSS styling here */
            .message {
              font-size: 18px;
              color: green;
              margin-bottom: 20px;
            }
            .button {
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="message">Token Verified</div>
          <a href="loalhost:3001/user/reset-password/:userId" class="button">Reset Password</a>
        </body>
        </html>
      `;
      
      res.status(200).send(buttonHtml);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
  
  //Reset User password
  const restUserpassword = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send("invalid link or expired");
  
      user.password = req.body.password;
      await user.save();
  
      res.status(200).send({
        message: "Password reset Sucessfully",
      });
    } catch (error) {
      res.send("An error occured");
      console.log(error);
    }
  };


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    verifyUser,
    forgetpassword,
    emailRestpassword,
    restUserpassword
    
};