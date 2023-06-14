const { Router } = require("express");

const {
  deleteUser,
  getUsers,
  getSingleUser,
} = require("./../controller/user.controller");
const router = Router();

router.route("/users").get(getUsers);
router.get('/users/delete/:id',deleteUser);
router.get('/users/:id',getSingleUser);
module.exports = router;
