const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./models");
const employeesRouter = require("./routes/employees");
const shiftRouter = require("./routes/shifts");
const shiftsListRouter = require("./routes/shiftsList");
const bodyParser = require("body-parser");
const morgan = require("morgan");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(express.json());
app.use("/employees", employeesRouter);
app.use("/shifts", shiftRouter);
app.use("/shifts_list", shiftsListRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
  });
});
