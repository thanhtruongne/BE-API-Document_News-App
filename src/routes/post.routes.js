import express from 'express';
import postController from '../adapters/controllers/post.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuth);

// Like a post
router.post('/:postId/like', postController.likePost);

// Unlike a post
router.post('/:postId/unlike', postController.unlikePost);

// Get post likes
router.get('/:postId/likes', postController.getPostLikes);

export default router; 