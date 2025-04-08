import postInteractionService from '../../services/post.interaction.service.js';
import { catchingAsyncAwait } from '../../utils/error.js';
import { REQUEST_CUSTOM } from '../../utils/response.js';

class PostController {
    constructor() {
        this.postInteractionService = postInteractionService;
    }

    likePost = catchingAsyncAwait(async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id; // Assuming user is authenticated and user info is in req.user

        const response = await this.postInteractionService.likePost(postId, userId);
        REQUEST_CUSTOM(res, 'Post liked successfully', response);
    });

    unlikePost = catchingAsyncAwait(async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id;

        const response = await this.postInteractionService.unlikePost(postId, userId);
        REQUEST_CUSTOM(res, 'Post unliked successfully', response);
    });

    getPostLikes = catchingAsyncAwait(async (req, res) => {
        const { postId } = req.params;

        const likes = await this.postInteractionService.getPostLikes(postId);
        REQUEST_CUSTOM(res, 'Post likes retrieved successfully', { likes });
    });
}

export default new PostController(); 