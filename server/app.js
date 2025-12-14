require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require('path')

const app = express()
const PORT = process.env.PORT || 9000;

app.use(cors( {
    credentials: true,
    origin: "http://localhost:5173"
} ));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/auth", require("./routes/authRoutes"))
app.use("/users", require("./routes/userRoutes"));
app.use("/friends", require("./routes/friendsRoutes"))
app.use("/posts", require("./routes/postRoutes"))
app.use("/comments", require("./routes/commentRoutes"))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});