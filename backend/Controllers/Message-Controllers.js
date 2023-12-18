const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Message = require("../Models/Message");
const flatted = require('flatted');

const createMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs passed, please check your data", 422);
    }
    if (!req.file) {
      throw new HttpError("No file provided", 422);
    }
    const { senderEmail, receiverEmail, senderName } = req.body;
  
    const createdMessage = new Message({
      senderEmail,
      senderName,
      receiverEmail,
      image: req.file.path,
      timestamp: new Date(), 
    });

    await createdMessage.save();
    console.log(createMessage);
    res.status(201).json({ createdMessage: flatted.stringify(createdMessage) });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not create a message, try with new message",
      500
    );
    return next(error);
  }
};

const getMessageByEmail = async (req, res, next) => {
  const email = req.params.email;
  console.log(email)
  let messages;
  try {
    messages = await Message.find({ receiverEmail: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find messages, please try again",
      500
    );
    return next(error);
  }
  if (!messages) {
    const error = new HttpError(
      " could not find message with the given email, please try again",
      404
    );
    return next(error);
  }
  res.json({ messages: messages });
};

const updateMessageById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again"));
  }
  const { status, id } = req.body;

  let message;
  try {
    message = await Message.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not find the message, please try again.",
      500
    );
    return next(error);
  }
  message.status = status;

  try {
    await message.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "something went wrong, Could not update the message, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: message });
};

const deleteMessageById = async (req, res, next) => {
  const id = req.body.id;
  let message;
  try {
    message = await Message.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the message, please try again",
      500
    );
    return next(error);
  }
  if (!message) {
    const error = new HttpError("message not found, please try again", 500);
    return next(error);
  }
  try {
    await message.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the message, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The message Successfully deleted" });
};
exports.createMessage = createMessage;
exports.getMessageByEmail = getMessageByEmail;
exports.updateMessageById = updateMessageById;
exports.deleteMessageById = deleteMessageById;
