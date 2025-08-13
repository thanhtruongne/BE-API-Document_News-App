import mongoose from "mongoose";
import { Api404Error } from "../../../../../frameswork/web/plugins/error.response.js";

const savePost = async (postID, user, userRepository) => {
    if (!postID) {
        throw new Api404Error('Post not found');
    }

    try {
        const userID = new mongoose.Types.ObjectId(user.userID);
        // Check if the post is already saved
        const checkExists = await userRepository.findByQuery({
            _id: userID,
            post_saves: { $in: [postID] }
        });

        if (checkExists) {
            // Remove post from saved posts
            await userRepository.updateOneQuery(
                { _id: userID },
                { $pull: { post_saves: postID } }
            );
            return false;
        }

        // Add post to saved posts
        await userRepository.updateOneQuery(
            { _id: userID },
            { $addToSet: { post_saves: postID } }
        );

        return true;
    } catch (error) {
        throw new Api404Error(error.message)
    }
}
export default savePost;








