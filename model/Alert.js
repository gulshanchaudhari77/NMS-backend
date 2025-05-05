// const mongoose =require("mongoose");

// const AlertSchema = new mongoose.Schema ({

//     type:
//     {
//         type:String,
//         required:true,
//     },
//     description: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
// })

// module.exports=mongoose.model("Alert",AlertSchema)

// Alert Model (backend)
// const mongoose = require("mongoose");

// const AlertSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Alert", AlertSchema);

const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Fire, Traffic, etc.
  description: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueStatus: {
    type: Boolean,
    default: true,
  },
  resolvedmessage: {
    type: String,
    required:false,

  },
  resolverperson: {
    // type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    type: String,

    required: false,
  },
  // Ensure correct reference to User model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", AlertSchema);
