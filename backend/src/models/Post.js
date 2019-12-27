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
    toJSON: {
        virtuals: true
    }
},
    {
        timestamps: true,
    });

PostSchema.virtual('image_url').get(function () {
    return `${process.env.URL}${this.image}`;
});

module.exports = model('Post', PostSchema);