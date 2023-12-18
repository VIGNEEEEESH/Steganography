const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const messageController = require("../Controllers/Message-Controllers");
const fileUpload = require("../middleware/file-upload");
router.post(
  "/createmessage",
  fileUpload.single("image"),
  [
    check("senderEmail").notEmpty(),
    check("senderName").notEmpty(),
    check("receiverEmail").notEmpty(),
  ],
  messageController.createMessage
);
router.get("/getmessage/byemail/:email", messageController.getMessageByEmail);
router.patch("/update", messageController.updateMessageById);
router.delete("/delete", messageController.deleteMessageById);
module.exports = router;
