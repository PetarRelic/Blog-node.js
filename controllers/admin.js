const mongoose = require('mongoose');
const fileHelper = require('../util/file');

const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 4;
    try{
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
        res.status(200).render('admin/posts', {
            posts: posts,
            pageTitle: 'Posts',
            path: '/admin/posts',
            totalItems: totalItems
        });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getAddPost = (req, res, next) => {
    res.render('admin/edit-post', {
        pageTitle: 'Add Post',
        path: '/admin/add-post',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddPost = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const content = req.body.content;
    const author = req.body.author;
    if(!image) {
        return res.status(422).render('admin/edit-post',{
            pageTitle: 'Add Post',
            path: '/admin/add-post',
            editing: false,
            hasError: true,
            post: {
                title: title,
                content: content,
                author: author
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-post', {
            pageTitle: 'Add Post',
            path: '/admin/add-post',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                content: content,
                author: author
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    
    const imageUrl = image.path;

    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        author: req.user
    });
    post.save()
        .then(result => {
            console.log('Created Post');
            res.redirect('/admin/post');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditPost = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                return res.redirect('/');
            }
            res.render('admin/edit-post', {
                pageTitle: 'Edit Post',
                path: '/admin/edit-post',
                editing: editMode,
                post: post,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postEditPost = (req, res, next) => {
    const postId = req.body.postId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedContent = req.body.content;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('/admin/edit-post', {
            pageTitle: 'Edit Post',
            path: '/admin/edit-post',
            editing: true,
            hasError: true,
            post: {
                title: updatedTitle,
                content: updatedContent,
                _id: postId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Post.findById(postId)
        .then(post => {
            if(post.userId.toString() !== req.user._id.toString()){
                return res.redirect('/');
            }
            post.title = updatedTitle;
            post.content = updatedContent;
            if(image){
                fileHelper.deleteFile(post.imageUrl);
                product.imageUrl = image.path;
            }
            return product.save().then(result => {
                console.log('UPDATED POST!');
                res.redirect('/admin/products');
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                return next(new Error('Post not found!'));
            }
            fileHelper.deleteFile(post.imageUrl);
            return Post.deleteOne({ _id: postId, userId: req.user._id });
        })
        .then(() => {
            console.log('DESTROYED POST');
            res.status(200).json({message: 'Success!'});
        })
        .catch(err => {
            res.status(500).json({message: 'Deleting post failed!'});
        });
};