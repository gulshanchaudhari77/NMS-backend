// const express = require("express");
// const router = express.Router();
// const http = require("http");
// const { Server } = require("socket.io");
// const Alert = require("../model/Alert"); // A new schema for storing alerts
// const User = require("../model/User"); // Existing User schema

// Post a new alert and notify all users
// router.post('/', async (req, res) => {
//   try {
//     const { type, description,userId } = req.body;

//     // Save the alert in the database
//     const newAlert = new Alert({
//       type,
//       description,
//       userId,
//       createdAt: new Date(),
//     });
//     await newAlert.save();

//     // Emit the alert to all connected clients using Socket.IO
//     req.app.get('io').emit('newAlert', newAlert); // Broadcast the alert to all connected clients

//     res.status(200).json({
//       success: true,
//       message: 'Alert sent and saved successfully!',
//       alert: newAlert,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to send alert',
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Alert = require("../model/Alert"); // Schema for alerts
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { type, description, userId, location } = req.body;

    // Save the alert in the database
    const newAlert = new Alert({
      type,
      description,
      userId,
      location,
      
    });
    await newAlert.save();

    // Emit the alert to all connected clients using Socket.IO
    const io = req.app.get("io"); // Get the Socket.IO instance
    io.emit("new-alert", newAlert);

    res.status(200).json({
      success: true,
      message: "Alert sent and saved successfully!",
      alert: newAlert,
    });
  } catch (error) {
    console.error("Error while sending alert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send alert",
      error: error.message,
    });
  }
});

router.get("/data", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: alerts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
});

router.get("/data/:id", async (req, res) => {
  const { id } = req.params;
  const cleanId = id.trim();

  try {
    const alert = await Alert.findById(cleanId).populate("userId"); // Find the alert by its ID

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "error fetching by id",
    });
  }
});

module.exports = router;
