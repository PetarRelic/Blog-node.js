const mongoose = require('mongoose');

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