const express = require('express');
const multer = require('multer')

const LikeController = require('./controllers/LikeController');
const PostController = require('./controllers/PostController');
const uploadConfig = require('./config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/posts', PostController.get);
routes.post('/posts', upload.single('image'), PostController.post);

routes.post('/posts/:id/likes', LikeController.post)

module.exports = routes;