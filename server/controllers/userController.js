const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

function createOutput(img) {
  if (fs.existsSync("output.png")) {
    return fsPromises.appendFile("output.png", img.data);
  } else {
    return fsPromises.writeFile("output.png", img.data);
  }
}

async function extractImage(x, y, width, height) {
  const buff = await sharp("output.png")
    .extract({
      left: parseInt(x),
      top: parseInt(y),
      width: parseInt(width),
      height: parseInt(height),
    })
    .toBuffer();
  return buff;
}
async function saveImage(buff, email) {
  if (
    !fs.existsSync(
      path.join(__dirname, "..", "images", "profile", `${email}.png`)
    )
  ) {
    fsPromises.writeFile(
      path.join(__dirname, "..", "images", "profile", `${email}.png`),
      buff
    );
  } else {
    fsPromises.appendFile(
      path.join(__dirname, "..", "images", "profile", `${email}.png`),
      buff
    );
  }
}

async function registerUser(req, res) {
  try {
    const {
      password,
      x,
      y,
      width,
      height,
      first_name,
      last_name,
      postal,
      gender,
      email,
      dob,
    } = req.body;
    const { img } = req.files;
    console.log(req.body);
    console.log(req.files);
    const hashed = bcrypt.hashSync(password, 10);
    const joined = new Date();
    const response = await User.insertUser({
      first_name,
      last_name,
      postal: parseInt(postal),
      gender,
      email,
      dob,
      joined,
      password: hashed,
    });
    if (!response) {
      return res.status(500).json({ message: "Database error." });
    }
    await createOutput(img);
    const extractedImg = await extractImage(x, y, width, height);
    await saveImage(extractedImg, email);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    const response = users.map((user) => {
      const obj = { ...user, password: undefined };
      return obj;
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  registerUser,
  getUsers,
};
