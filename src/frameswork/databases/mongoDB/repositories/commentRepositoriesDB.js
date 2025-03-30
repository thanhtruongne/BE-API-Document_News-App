import { omit } from "../../../../utils/index.utils.js"
import comment from "../models/comment.js"



const commentRepositoriesDB = () => {
    
    const storeResource = async(payload) => {
        return await comment.create({
            postId : payload.getPostID(),
            content : payload.getContent(),
            full_name : payload.getFullName(),
            parent_id : payload.getParentID()
        })
    }

    const updateResource = async(_id,payload) => {
        return await comment.findByIdAndUpdate(_id,payload,{
            new : true
        })
    }

    const updateStatusResource = async(_id,payload) => {
        return await comment.findByIdAndUpdate(_id,{
            status : payload.getStatus()
        },{
            new : true
        })
    }

    const removeResource = async(_id) => {
        return await comment.findByIdAndDelete(_id)
    }

    const findByID = async(_id) => {    
        return await comment.findById(_id).lean().exec()
    }

    const findByQuery = async(query) => {
        return await comment.find(omit(query,'limit'))
        .limit(query?.limit || 4)
        .sort(query.sort || { createdAt: 1 })
        .lean()
        .exec()
    }



    return {
        storeResource,updateResource,removeResource,updateStatusResource,findByID,findByQuery
    }
}



export default commentRepositoriesDB