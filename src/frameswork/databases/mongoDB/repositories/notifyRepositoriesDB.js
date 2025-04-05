import notification from "../models/notification.js";


const notifyRepositoriesDB = () => {

    const createResource = async(payloadEntities) => {
        return await notification.create({
            full_name : payloadEntities.getFullName(),
            content : payloadEntities.getContent(),
            author : payloadEntities.getAuthor(),
            link : payloadEntities.getLink(),
            postId : payloadEntities.getPostID(),
            type : payloadEntities.getType(),
            like : payloadEntities.getLike(),
            recipient : payloadEntities.getRecipient(),
            title : payloadEntities.getTitle(),
        })
    }


    return {
        createResource
    }
}



export default notifyRepositoriesDB