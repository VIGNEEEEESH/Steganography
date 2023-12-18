const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userController = require("../Controllers/User-Controllers");

router.post(
  "/createuser",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.createUser
);
router.get("/get/allusers", userController.getUsers);
router.post("/login", userController.login);
router.get("/getuser/:email", userController.getUserByEmail);
router.get("/getuser/byid/:userId", userController.getUserById);
router.patch(
  "/update/:email",
  [check("name").notEmpty(), check("password").isLength({ min: 6 })],
  userController.updateUser
);
router.delete("/delete/:email", userController.deleteUser);
module.exports = router;
