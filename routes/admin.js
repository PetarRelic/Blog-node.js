const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//get all the posts
router.get('/posts', isAuth, adminController.getPosts);

//getting the page to add a post
router.get('/add-post', isAuth, adminController.getAddPost);

//creating new post
router.post('/add-post',
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('content').isString().isLength({ min: 3 }).trim()
        //body('image').not().isEmpty()
    ],
isAuth,
adminController.postAddPost);


router.get('/edit-post/:postId', isAuth, adminController.getEditPost);

//posting the edited post
router.post('/edit-post', [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('content').isString().isLength({ min: 3 }).trim()
],
isAuth,
adminController.postEditPost);

//deleting post
router.delete('/post/:postId', isAuth, adminController.deletePost);


module.exports = router;