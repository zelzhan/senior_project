const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const { Server } = require("ws");
const { socketService } = require("./services/socketService");

const app = express();
const indexRouter = require("./routes/index");

app.use("/", indexRouter);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Import the mongoose module
//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoose.connection.on("open", (event) => {
  console.log("connected to db!");
});

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/test";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const server = app.listen(4000);
const wss = new Server({ server: server, path: "/sensor-data" });

wss.on("connection", (socket) => {
  socketService(socket);
});

module.exports = {
  ...app,
};
