const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: { post: [
        {
            postId: {
                type: Schema.Types.ObjectId,
                ref: 'Post',
                required: true
            }
        }
        ]
    }
});


module.exports = mongoose.model('User', userSchema);