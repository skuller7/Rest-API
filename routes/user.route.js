const express = require("express");
const router = express.Router();
const {getUsers, getUser, createUser, updateUser, deleteUser, promoteUser} = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.get('/', protect, isAdmin, getUsers);
router.get("/:id", protect, getUser);

router.post("/", createUser);
router.put("/:id", protect, updateUser)
router.put("/:id/promote", protect, isAdmin, promoteUser)
router.delete("/:id", protect, isAdmin, deleteUser)

module.exports = router;
