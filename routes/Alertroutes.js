// const express=require("express");
// const Alert=require("../model/Alert");

// const router = express.Router();


// router.post("/",async(req,res)=>{
//     try{

//         const{type,description}=req.body;

//         const newAlert = new Alert({ type, description });

//     await newAlert.save();

//     res.status(201).json(newAlert);

//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }



  


// })



// router.get('/', async (req, res) => {
//     try {
//       const alerts = await Alert.find().sort({ createdAt: -1 });
//       res.json(alerts);
//     } catch (err) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
//   module.exports = router;

// API Route for sending alerts (backend)
const Alert = require("../model/Alert");
const User = require("../model/User");
const express = require("express");
const router = express.Router();

// Send alert to all users
router.post("/", async (req, res) => {
  try {
     console.log("Request Body:", req.body);

    const { type, description, userId, location } = req.body;
    
    // Create and save the new alert
    const newAlert = new Alert({
      type,
      description,
      userId,
      location
    });

    // if (!userId) {
    //   return res.status(400).json({ success: false, message: "userId is required" });
    // }
    

    console.log("first userId",userId)

    await newAlert.save();

    // Fetch all users to update their Notification array
    const users = await User.find(); 

    // Add the alert to each user's Notification array
    await Promise.all(
      users.map(async (user) => {
        user.Notification.push(newAlert);
        await user.save(); // Save the updated user
      })
    );
    
    res.status(200).json({
      success: true,
      message: "Alert sent to all users alertrout",
      alert: newAlert,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send alert1",
    });
  }
});




//Get all alerts for dashboard
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().populate("userId", "username email");
    // console.log(alerts)
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
});



module.exports = router;




