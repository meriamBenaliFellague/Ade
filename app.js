require("dotenv").config();
const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const path = require("path");
const { SchemaMessage } = require("./model/messageDB"); 
 
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({
  origin: 'http://127.0.0.1:5500', // أو حسب الدومين تاع الفرونت
  credentials: true               // ⬅️ لازم هذا باش يسمح بالكوكي
}));
app.use(session({
  secret: 'secret-key',         // 🔑 مفتاح التشفير (بدلوه في مشروعك الحقيقي)
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }     // ⚠️ حطها `true` فقط إذا كنت تستعمل HTTPS
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/Home/register',express.static(path.join(__dirname, "public/loginClient")));
app.use('/Home/LoginAdmin/Admin',express.static(path.join(__dirname, "public/AdminDashoard")));
app.use('/Home',express.static(path.join(__dirname, "public/home-page")));
app.use('/Home/LoginAdmin',express.static(path.join(__dirname, "public/loginAdmin")));
app.use('/Home/LoginAdmin/Dashboard',express.static(path.join(__dirname, "public/AdminDashoard")));
app.use('/Home/LoginLeader/Dashboard',express.static(path.join(__dirname, "public/RespDashoard")));
app.use('/Reclamation',express.static(path.join(__dirname, "public/client")));


const authRoutes = require("./server/ClientRegist");
app.use(authRoutes);
const adminRoutes = require("./server/AdminLogin");
app.use(adminRoutes);

const createAccount = require("./server/ClientRegist");
app.use("/api/register", createAccount);

const loginAccount = require("./server/ClientLogin");
app.use("/api/login",loginAccount);

const forgetPassword = require("./server/forgetPassword");
app.use("/api/forgetPassword",forgetPassword);

const verifyResetCode = require("./server/VerifyResetCode");
app.use("/api/VerifyResetCode",verifyResetCode);

const resetPassword = require("./server/ResetPassword");
app.use("/api/ResetPassword",resetPassword);

const createReclamation = require("./server/AddReclamation");
app.use("/api/addReclamation",createReclamation);

const loginAdmin = require("./server/AdminLogin");
app.use("/api/Admin",loginAdmin);

const loginUser = require("./server/UserLogin");
app.use("/api/UserLogin",loginUser);

const createtUser = require("./server/CreateUser");
app.use("/api", createtUser);

const displayUser = require("./server/DisplayUser");
app.use("/api/displayUser", displayUser);

const displayMessage = require("./server/DisplayMessage");
app.use("/api/DisplayMessages", displayMessage);

const DisplayMessageLeader = require("./server/DisplayMessageLeader");
app.use("/api/DisplayMessagesLeader", DisplayMessageLeader);

const deletUser = require("./server/DeletUser");
app.use("/api/DeleteUser", deletUser);   

const deletRec = require("./server/DeletRec");
app.use("/api/DeleteRec", deletRec);  

const update_user = require("./server/UpdateUser");
app.use("/api/UpdateUser", update_user);

const display_leaders = require("./server/DisplayLeader");
app.use("/api/Displayleader", display_leaders);

const display_team_members = require("./server/DisplayTeam");
app.use("/api/DisplayTeam", display_team_members);

const display_information = require("./server/Displayinformation");
app.use("/api/DisplayInformation", display_information);

const display_reclamation_client = require("./server/DisplayReclamationClient");
app.use("/api/DisplayReclamationClient", display_reclamation_client);

const display_reclamation_leader = require("./server/DisplayReclamationLeader");
app.use("/api/DisplayReclamationLeader", display_reclamation_leader);

const display_reclamation_admin = require("./server/DisplayReclamationAdmin");
app.use("/api/DisplayReclamationAdmin", display_reclamation_admin);

const update_reclamation_status_admin = require("./server/UpdateReclamationStatusAdmin");
app.use("/api/UpdateReclamationAdmin", update_reclamation_status_admin);

const update_reclamation_status_leader = require("./server/UpdateReclamationStatusLeader");
app.use("/api/UpdateReclamationLeader", update_reclamation_status_leader);

const Analytics = require("./server/Analytics");
app.use("/api/Analytics", Analytics);

//.....

app.get("/Home", (req, res) => {
  res.sendFile(path.join(__dirname, "public/HomePage","index.html"));
});

app.get("/Home/LoginAdmin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/loginAdmin","login.html"));
});

app.get("/Reclamation", (req, res) => {
  res.sendFile(path.join(__dirname, "public/client","index.html"));
});

app.get("/Home/LoginAdmin/Dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/AdminDashboard","index.html"));
});



//database connection

const router = require("./server/ClientLogin");
const dbUrl = process.env.dbUrl;

mongoose 
  .connect(dbUrl) 
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });


// Chat


/*
io.on('connection', socket => {

  // Load old messages
  SchemaMessage.find().sort({ createdAt: 1 }).then(messages => {
      socket.emit('load-messages', messages);
  });

   socket.on('send-chat-message', async (message) => {
    const sentMessage = new SchemaMessage({ type: 'sent', message });
    const receivedMessage = new SchemaMessage({ type: 'received', message });
    await sentMessage.save();
    await receivedMessage.save();
  
    socket.broadcast.emit('chat-message', receivedMessage);
    socket.emit('chat-message', sentMessage);
  })
})*/
const http = require("http");
const server = http.createServer(app); // لازم تستخدم createServer

const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // ⚠️ لازم تكون نفس origin تاع الفرونت
    methods: ["GET", "POST"],
    credentials: true
  }
});


//const io = require('socket.io')(app);
const { SchemaTeam } = require("./model/TeamDB");
const admin = mongoose.connection.collection("admin");

// Socket.IO Logic
const onlineUsers = new Map(); // Keep track of online users

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  let senderId;
  // Register user when they connect
  socket.on("register", async (userId) => {
    try {
      // Validate if user is either an admin or a leader
      const isLeader = await SchemaTeam.findById(userId);
      const isAdmin = await admin.findOne({ _id: new mongoose.Types.ObjectId(userId) });

      if (isLeader || isAdmin) {  
        senderId = userId;
          onlineUsers.set(userId, socket.id);
          socket.emit("registration_success",userId);
          // Load old messages
          socket.emit('load-messages');
        
      } else {
          socket.emit("registration_error", "Invalid user");
      }
  } catch (error) {
      console.error("Registration error:", error);
      socket.emit("registration_error", "Server error during registration");
  }
  });

  //get receiverId
  let receiverId /* = await SchemaTeam.findOne();
  */
  socket.on("get receiverId", async (userID) => {
    receiverId = userID;
    console.log("receiverId Admin",receiverId)
  })
  

  // Handle private messages
  socket.on("private_message", async (message) => {//receive messege and sent to receiver
    try{let newMsg;
    const lead = await SchemaTeam.findById(senderId);
    if(lead){console.log("leader is sender")
      const sender = lead;
      const receiver = await admin.findOne(); 
      receiverId = receiver._id.toString();
      //onlineUsers.set(receiverId , socket.id);
      // Save the message to the database
         newMsg = new SchemaMessage({ leaderId: senderId, sender: true, message });
        await newMsg.save();
       
      
    }else{console.log("admin is sender")
      const sender = await admin.findOne();
      const receiver = lead; 
      // Save the message to the database
        newMsg = new SchemaMessage({ leaderId: receiverId, sender: false, message });
        await newMsg.save();
      
    }

    // Send the message to the receiver if they're online
    const receiverSocket = onlineUsers.get(receiverId);
    console.log(receiverId)
if (receiverSocket) {
  io.to(receiverSocket).emit("receive_message", newMsg); // ✅ استخدم socket ID
  console.log(receiverSocket);
}
    console.log(receiverSocket)
  } catch (err) {
    console.error("Message send error:", err);
  }
  }); 




  // Handle disconnection
  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO ready on http://localhost:${PORT}`);
}); 
module.exports = io; 