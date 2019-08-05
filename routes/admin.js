const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

//get all the posts
router.get('/posts', adminController.getPosts);


module.exports = router;