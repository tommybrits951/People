const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path")
const { createOutput, extractImage, saveImage } = require("../config/imageConfig");


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
    await saveImage(path.join(__dirname, "..", "images", "profile", `${email}.png`), extractedImg);
      
    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
}


async function getUser(req, res) {
  try {
    const {user_id} = req.params;
    const user = await User.getById(user_id)
    console.log(user)
    if (!user) {
      return res.status(404).json({message: "Could not find user."})
    }
    res.json(user)
  } catch (err) {
    return res.status(500).json({message: err.message || "Server error."})
  }
}
module.exports = {
  registerUser,
  getUsers,
  getUser
};
