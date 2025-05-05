const express = require("express");
const router = express.Router();
const Alert = require("../model/Alert"); // Schema for alerts
const User = require("../model/User");
const { param } = require("./Alertroutes");

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { message, userId } = req.body;

    console.log("req.body ", req.body);
    console.log("id ", id);

    if (!id || !userId) {
      return res.status(403).json({
        message: "data not present",
        success: false,
      });
    }
    const user = await User.findById(userId);
    const notification = await Alert.findById(id);

    if (!notification || !user) {
      return res.status(404).json({
        message: "Notification or User not found, try again",
        success: false,
      });
    }

    notification.resolvedmessage = message;
    notification.resolverperson = userId;
    notification.issueStatus = false;

    const savedNoti1 = await notification.save();

    const savedNoti = await Alert.findById(savedNoti1._id)
      .populate("userId")
      .populate("resolverperson")
      .exec();
    console.log("savedNoti ", savedNoti);

    res.status(200).json({
      succes: true,
      message: "Resolved message saved Successfully",
      savedNoti,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "error submit msg",
    });
  }
});

module.exports = router;
