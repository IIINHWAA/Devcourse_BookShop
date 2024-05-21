const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT);

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);