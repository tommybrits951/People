require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express()
const PORT = process.env.PORT || 9000;

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use("/auth", require("./routes/authRoutes"))
app.use("/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});