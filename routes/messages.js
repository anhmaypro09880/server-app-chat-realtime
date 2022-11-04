const {
    addMessage,
    getMessages,
    imageMessageSend,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/image-message-send/", imageMessageSend);

module.exports = router;
