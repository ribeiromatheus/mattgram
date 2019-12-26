const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const Post = require('../models/Post');


module.exports = {
    async get(req, res) {
        const posts = await Post.find().sort('-createdAt');

        return res.json(posts);
    },

    async post(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image, path: currentPath, destination } = req.file;

        await sharp(currentPath)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(path.resolve(destination, 'resized', image));

        fs.unlinkSync(currentPath);

        const post = await Post.create({
            image: image,
            author,
            place,
            description,
            hashtags
        });

        req.io.emit('post', post);

        return res.json(post);
    }
};