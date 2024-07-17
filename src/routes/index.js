const { Router } = require("express");
const express = require("express");
const app = express();
const rootRouter = Router();


const userRouter = require("./user.routes")

rootRouter.use("/user", userRouter);



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