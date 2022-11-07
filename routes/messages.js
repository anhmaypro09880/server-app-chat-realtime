const {
    addMessage,
    getMessages,
    imageMessageSend,
    fileMessageSend,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/image-message-send/", imageMessageSend);
router.post("/file-message-send/", fileMessageSend);

module.exports = router;
