// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const alertRoutes = require('./routes/Alertroutes');
// const singuproute=require("./routes/signup")
// const loginRoute=require("./routes/login")
// const sendAlert=require("./routes/sendalert")
// const auth=require("./middleware/Auth")

// // Load environment variables
// dotenv.config();



// // Connect to MongoDB
// connectDB();

// const app = express();

// const server=http.createServer(app);

// // Middleware
// app.use(cors());
// app.use(express.json());


// // Routes
// app.use('/api/alert', alertRoutes);
// app.use("/api/user",singuproute)
// app.use("/api/login",loginRoute)
// app.use("/api/sendAlert",sendAlert)

// // Socket.IO Real-time Communication
// // io.on('connection', (socket) => {
// //   console.log('A user connected:', socket.id);

// //   // Listen for new alert submissions
// //   socket.on('report-alert', (alertData) => {
// //     console.log('New Alert:', alertData);

// //     // Broadcast the alert to all connected clients
// //     io.emit('new-alert', alertData);
// //   });

// //   // Handle disconnection
// //   socket.on('disconnect', () => {
// //     console.log('A user disconnected:', socket.id);
// //   });
// // });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const alertRoutes = require("./routes/Alertroutes");
const singuproute = require("./routes/signup");
const loginRoute = require("./routes/login");
const sendAlert = require("./routes/sendalert");
const ResolveRoute=require("./routes/ResolveRoute")


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: "https://nms-f.vercel.app", methods: ["GET", "POST"] })); // Allow requests from React
app.use(express.json());

// Initialize Socket.IO with CORS support
const io = new Server(server, {
  cors: {
    origin: "https://nms-f.vercel.app", // ✅ Updated to deployed frontend
    methods: ["GET", "POST"],
  },
});


// Routes
app.use("/api/alert", alertRoutes);
app.use("/api/user", singuproute);
app.use("/api/login", loginRoute);
app.use("/api/sendAlert", sendAlert);
app.use("/api/submitmsg",ResolveRoute)






// Socket.IO Real-time Communication
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Broadcast a new alert
  socket.on("report-alert", (alertData) => {
    console.log("New Alert:", alertData);
    io.emit("new-alert", alertData); // Broadcast to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Pass the Socket.IO instance to other routes
app.set("io", io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
