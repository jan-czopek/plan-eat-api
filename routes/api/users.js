const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.route('/')
  .get(userController.getUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)

router.route('/:id')
  .delete(userController.deleteUser)
  .get(userController.getUser)

module.exports = router;