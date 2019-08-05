const path = require('path');
const fs = require('fs');

//Third party dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

//calling of custom modules
const User = require('./models/user');

// database connection string
const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0-4qmwr.mongodb.net/blog?retryWrites=true&w=majority';

//MIDDLEWARES
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-')+ '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jfif'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//routes
const adminRoutes = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/admin', adminRoutes);


mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });