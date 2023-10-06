const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');

router.route('/')
  .get(postController.getPosts)
  .post(postController.createPost)
  .patch(postController.updatePost)

router.route('/:id')
  .delete(postController.deletePost)
  .get(postController.getPost)

module.exports = router;