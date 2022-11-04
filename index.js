const express = require("express");
const expressfileupload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuid } = require("uuid");
const path = require("path");
const {
    addMessage,
    getMessages,
    imageMessageSend,
} = require("./controllers/messageController");

require("dotenv").config();

app.use(cors());
app.use(express.json());
// app.use(expressfileupload());

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESSKEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESSKEY,
        region: process.env.S3_BUCKET_REGION,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, "");
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 200000 },
});

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.post(imageMessageSend, upload.single("images"), (req, res) => {
    console.log("connected images");
});

const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log("Co nguoi ket noi");
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log("Add user online");
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log("Nghe Send - msg");
        // console.log("Data mesage :" + data.message);
        // console.log("Data image :" + data.image);
        if (sendUserSocket) {
            console.log("Gui message recive");
            socket.to(sendUserSocket).emit("msg-recieve", data);
        }
    });
});
