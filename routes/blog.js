const path = require('path');

const express = require('express');

const blogController = require('../controllers/blog');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//getting all the posts
router.get('/posts', blogController.getPosts);

//getting single post
router.get('/posts/:postId', blogController.getPost);


module.exports = router;