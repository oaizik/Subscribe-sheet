const express = require("express");
const controller = require("./controller/controller");

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

// wait for get request to "/getUserMail" path with the "email" query field
app.get("/getUserMail", controller.getUserMail);


app.listen(port, () =>
  console.log("Express server ready for requests on port:", port)
);
