const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    author: String,
    place: String,
    description: String,
    image: String,
    likes: {
        type: Number,
        default: 0
    },
    hashtags: String,
}, {
    timestamps: true,
});

module.exports = model('Post', PostSchema);