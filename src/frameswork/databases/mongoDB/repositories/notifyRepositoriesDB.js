import { omit } from "../../../../utils/index.utils.js";
import notification from "../models/notify.js";

const notifyRepositoriesDB = () => {

    const createNotify = async (payloadEntities) => {
        return await notification.create({
            subject: payloadEntities.getSubject(),
            content: payloadEntities.getContent(),
            userId: payloadEntities.getUserID(),
            url: payloadEntities.getURL(),
            postId: payloadEntities.getPostID(),
            type: payloadEntities.getType(),
            markAread: payloadEntities.getMarkAread(),
            status: payloadEntities.getStatus(),
        })
    }

    const getAllNotify = async (params) => {
        return await notification.find(omit(params, 'select', 'perPage', 'sort', 'page'))
            .select(params.select)
            .populate([
                {
                    path: "userId",
                    select: "avatar imageURL full_name",
                },
                {
                    path: "postId",
                    select: "thumb imageURL"
                }
            ])
            .skip(params.perPage * params.page - params.perPage)
            .limit(params.perPage)
            .sort(params.sort)
            .exec()
    }

    const updateByPayload = async (payload) => {
        return notification.updateMany({
            markAread: false
        },
            payload,
            {
                new: true,
                runValidators: true
            })
    }

    const updateOneById = async (_id, payload) => {
        return await notification.updateOne({
            _id
        },
            payload,
            {
                new: true,
                runValidators: true
            })
    }

    const countDocumentByQuery = async (query) => await notification.countDocuments(query);

    return {
        createNotify,
        getAllNotify,
        updateByPayload,
        updateOneById,
        countDocumentByQuery
    }
}



export default notifyRepositoriesDB