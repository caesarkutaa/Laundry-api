require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors")
const rootRouter = require('./routes'); // assuming routes are in a file called routes.js

app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Connect database   
// Connect database   
require('./DB/db').connect()

app.use('/', rootRouter); // use the rootRouter

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
   