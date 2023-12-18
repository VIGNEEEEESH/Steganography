const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { name, email, password, publicKey, privateKey } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "Email already exists, please try loggin in",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not signup, please try again",
      500
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    publicKey,
    privateKey,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not create User, please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, signing up failed, please try again",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password -privateKey");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find Users, please try again",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};
const getUserIds = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, { password: 0, email: 0, image: 0, name: 0 });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find Users, please try again",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUsers;
  try {
    existingUsers = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);

    return next(error);
  }
  if (!existingUsers) {
    const error = new HttpError(
      "Invalid crudentials, email is always small (even though you have given capital letters while creating), please try again,",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUsers.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your crudentials and try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUsers.id, email: existingUsers.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, signing up failed,please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: existingUsers.id,
    email: existingUsers.email,
    token: token,
  });
};
const getUserByEmail = async (req, res, next) => {
  const email = req.params.email;

  let user;
  try {
    user = await User.findOne({ email: email }, "-password -privateKey");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the User",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find the user with the given email",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: user });
};
const getUserById = async (req, res, next) => {
  const _id = req.params.userId;

  let user;
  try {
    user = await User.findById({ _id }, "-password");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the User",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: user });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }
  const email = req.params.email;
  const { name, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the User or could not update the User, please try again",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "the is no user with the give mail, please try again",
      500
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not update the user, please try again",
      500
    );
    return error;
  }
  (user.name = name), (user.password = hashedPassword);

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, updating  failed, please try again",
      500
    );
  }
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, updating failed,please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: user.id, email: user.email, token: token });
};
const deleteUser = async (req, res, next) => {
  const email = req.params.email;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the User , please try again",
      500
    );
    return next(error);
  }
  if (!user) {
    return next(new HttpError("User not found"));
  }

  try {
    await user.deleteOne();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "something went wrong, could not delete the user, please try again",
      500
    );
    return next(error);
  }
};
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById=getUserById
exports.getUserIds = getUserIds;
exports.login = login;
exports.getUserByEmail = getUserByEmail;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
