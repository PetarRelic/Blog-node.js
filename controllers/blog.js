const fs = require('fs');
const path = require('path');

const Post = require('../models/post');

const ITEMS_PER_PAGE = 1;


exports.getPosts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Post.find()
    .countDocuments()
    .then(numPosts => {
        totalItems = numPosts;
        return Post.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
        res.render('blog/post-list', {
            posts: posts,
            pageTitle: 'Posts',
            path: '/posts',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            res.render('blog/post-detail', {
                post: post,
                pageTitle: post.title,
                path: '/posts'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
