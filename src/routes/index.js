const { Router } = require("express");
const express = require("express");
const app = express();
const rootRouter = Router();


const userRouter = require("./user.routes")
const laundryItemRouter = require("./laundry.routes")
const orderRouter = require("./order.routes")
const WalletRouter = require("./wallet.routes")
const paymentRouter = require("./payment.routes")
const auth = require("../middleware/authentication")


rootRouter.use("/user", userRouter);
rootRouter.use("/laundry",auth, laundryItemRouter);
rootRouter.use("/order",auth,orderRouter)
rootRouter.use("/wallet",auth,WalletRouter)
rootRouter.use("/payment",auth,paymentRouter)

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
  });
  
  app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
  
    res.status(status);
    res.render("error");
  });
  
  module.exports = rootRouter