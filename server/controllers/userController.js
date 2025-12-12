const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path")
const { createOutput, extractImage, saveImage } = require("../config/imageConfig");


async function registerUser(req, res) {
  try {
    const {
      // Basic Info
      password,
      first_name,
      last_name,
      email,
      
      // Profile Info
      dob,
      gender,
      phone,
      bio,
      location,
      city,
      state,
      postal,
      country,
      
      // Social & Professional
      occupation,
      company,
      education,
      website,
      facebook_url,
      twitter_url,
      instagram_url,
      linkedin_url,
      github_url,
      
      // Interests & Preferences
      interests,
      skills,
      relationship_status,
      looking_for_work,
      timezone,
      notifications_enabled,
      profile_public,
      
      // Image cropping
      x,
      y,
      width,
      height,
    } = req.body;
    
    const { img } = req.files;
    const hashed = bcrypt.hashSync(password, 10);
    const joined = new Date();
    
    // Parse JSON fields if they come as strings
    const parsedInterests = interests ? (typeof interests === 'string' ? JSON.parse(interests) : interests) : null;
    const parsedSkills = skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : null;
    
    const response = await User.insertUser({
      // Basic Info
      first_name,
      last_name,
      email,
      password: hashed,
      
      // Profile Info
      dob,
      gender: gender || "Private",
      phone: phone || null,
      bio: bio || null,
      location: location || null,
      city: city || null,
      state: state || null,
      postal: postal ? parseInt(postal) : null,
      country: country || null,
      
      // Social & Professional
      occupation: occupation || null,
      company: company || null,
      education: education || null,
      website: website || null,
      facebook_url: facebook_url || null,
      twitter_url: twitter_url || null,
      instagram_url: instagram_url || null,
      linkedin_url: linkedin_url || null,
      github_url: github_url || null,
      
      // Interests & Preferences
      interests: parsedInterests,
      skills: parsedSkills,
      relationship_status: relationship_status || null,
      looking_for_work: looking_for_work === 'true' || looking_for_work === true ? true : false,
      timezone: timezone || null,
      notifications_enabled: notifications_enabled === 'false' || notifications_enabled === false ? false : true,
      profile_public: profile_public === 'false' || profile_public === false ? false : true,
      
      // Account Activity
      joined,
      last_login: joined,
      updated_at: joined,
      
      // Account Status
      is_verified: false,
      is_active: true,
    });
    
    if (!response) {
      return res.status(500).json({ message: "Database error." });
    }

    // Handle image upload if provided
    if (img) {
      await createOutput(img);
      const extractedImg = await extractImage(x, y, width, height);
      await saveImage(path.join(__dirname, "..", "images", "profile", `${email}.png`), extractedImg);
    }
      
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
