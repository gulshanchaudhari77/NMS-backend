const User = require("../model/User");
const express = require("express");
 const bcrypt = require("bcryptjs"); // Import bcrypt

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const userModel = new User({ username, email, password });

          userModel.password = await bcrypt.hash(password, 10);

        // Create a new user
        await userModel.save();


        

        console.log(userModel);

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating user",
        });
    }
});

module.exports = router;
