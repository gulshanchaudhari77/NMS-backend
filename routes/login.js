const User = require("../model/User");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request:", email, password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password are required",
      });
    }

    const user = await User.findOne({ email }).populate("Notification");
    console.log("User Found:", user);

    const errorMsg = "Auth failed: email or password is wrong";

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Stored Password (Hashed):", user.password);
    const isPassEqual = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isPassEqual);

    if (!isPassEqual) {
      return res.status(403).json({
        success: false,
        message: errorMsg,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("JWT Token:", jwtToken);

    res.status(200).json({
      success: true,
      jwtToken,
      email,
      message: "Login successful!!",
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during login",
    });
  }
});

router.post("/user", async(req, res, next) => {
  try {
    //extract token
    console.log("token ");
    // console.log("req.cookies.token ", req?.cookies?.token);
    const token =
      req?.cookies?.token ||
      req?.body?.token ||
      req?.header("Authorization").replace("Bearer ", "");

    console.log("token ", token);

    //if token missing, then return responce
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    console.log("process.env.JWT_SECRET ", process.env.JWT_SECRET)

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
    //   req.user = decode;
        const {_id} = decode;

        const userData = await User.findById(_id);
        console.log("userData ", userData);

        return res.status(200).json({
            success: true,
            message: "data fetched successfully",
            userData
          });

    } catch (err) {
      //verification - issue
      return res.status(404).json({
        success: false,
        message: "Token is invalid",
      });
    }

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
});

module.exports = router;
