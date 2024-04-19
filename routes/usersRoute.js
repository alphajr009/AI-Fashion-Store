const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Otp = require("../models/otp");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const newUser = new User({ email, password });
    const user = await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        const temp = {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
        };
        res.send(temp);
      } else {
        return res.status(400).json({ message: "Password incorrect" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getuserbyid", async (req, res) => {
  const { userid } = req.body;

  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).send("Failed to get user by ID");
  }
});

router.post("/changepasswordOtp", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteOne({ email });

    res.send("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Failed to change password");
  }
});

router.post("/changepassword", async (req, res) => {
  const { id, previousPwd, newPwd } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== previousPwd) {
      return res.status(400).json({ message: "Previous password incorrect" });
    }

    user.password = newPwd;
    await user.save();

    res.send("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Failed to change password");
  }
});

router.post("/getuserbyid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const user = await User.find({ _id: userid });
    res.send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.patch("/updateuser", async (req, res) => {
  const { _id, name, city, gender, phone, birthday, address } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    user.city = city;
    user.gender = gender;
    user.phonenumber = phone;
    user.birthday = new Date(birthday);
    user.address = address;

    await user.save();
    return res.json({ message: "User details updated successfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
