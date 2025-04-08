import postInteractionQueue from '../config/bull/post.interaction.queue.js';
import { config } from '../config/config.js';
import { postRepositoriesDB } from '../frameswork/database/mongodb/repositories/post.repository.js';

const logger = config.createLogger('postInteractionService');

class PostInteractionService {
    constructor() {
        this.postRepository = postRepositoriesDB();
    }

    async likePost(postId, userId) {
        try {
            // Check if post exists
            const post = await this.postRepository.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            // Check if user already liked
            if (post.likes.includes(userId)) {
                throw new Error('User already liked this post');
            }

            // Add job to queue
            await postInteractionQueue.add('like', { postId, userId });
            
            // Update Redis cache if needed
            // ... (implement Redis cache update logic)

            return { success: true, message: 'Like request processed' };
        } catch (error) {
            logger.error(`Error in likePost: ${error.message}`);
            throw error;
        }
    }

    async unlikePost(postId, userId) {
        try {
            // Check if post exists
            const post = await this.postRepository.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            // Check if user has liked
            if (!post.likes.includes(userId)) {
                throw new Error('User has not liked this post');
            }

            // Add job to queue
            await postInteractionQueue.add('unlike', { postId, userId });
            
            // Update Redis cache if needed
            // ... (implement Redis cache update logic)

            return { success: true, message: 'Unlike request processed' };
        } catch (error) {
            logger.error(`Error in unlikePost: ${error.message}`);
            throw error;
        }
    }

    async getPostLikes(postId) {
        try {
            const post = await this.postRepository.findById(postId);
            return post ? post.likes : [];
        } catch (error) {
            logger.error(`Error in getPostLikes: ${error.message}`);
            throw error;
        }
    }
}

export default new PostInteractionService(); 