import { omit } from "../../../../utils/index.utils.js"
import posts from "../models/posts.js"
const postRepositoriesDB = () => {

    const createResource = async(payloadEntities) => {
        return await posts.create({
            title : payloadEntities.getTitle(),
            description : payloadEntities.getDescription(),
            content : payloadEntities.getContent(),
            thumb : payloadEntities.getThumb(),
            status : payloadEntities.getStatus(),
            categories_id : payloadEntities.getCategoriesID(),
            images : payloadEntities.getImages(),
            isTrending : payloadEntities.getIsTrending(),
            type : payloadEntities.getType(),
            author_id : payloadEntities.getAuhtorID() ?? null,
            videos : payloadEntities.getVideos() ?? null,
            media_type : payloadEntities.getMediaType()
        })  
    }

    const fetchAllData = async(params) => {
        return await posts.find(omit(params,'page','perPage','select','sort'))
        .select(params.select)  
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage)
        .populate([ 
            {
                path : "categories_id",
                select : "title _id parent_id",
            },
            {
                path : "author_id",
                select : "_id full_name"
            }
        ])
        .sort(params?.sort)
        .lean()
        .exec()

    }


    const fetchCountAll = async(params) => {
       return await posts.countDocuments(omit(params,'page','perPage','select'));
    }

    const findDetail = async(query) => {
        return await posts.find(query).populate([ 
            {
                path : "categories_id",
                select : "title _id parent_id",
            },
            {
                path : "author_id",
                select : "_id full_name"
            }
        ]).lean().exec()

    }

    const findById = async(_id) => {
        return await posts.findById(_id)
        // .lean()
        .exec();
    }

    const findByIDandUpdate = async(_id,payload) => {
        const data = {
            title : payload.getTitle(),
            description : payload.getDescription(),
            categories_id : payload.getCategoriesID(),
            status : payload.getStatus(),
            content : payload.getContent(),
            thumb : payload.getThumb(),
            images : payload.getImages(),
            isTrending : payload.getIsTrending(),
            author_id : payload.getAuhtorID(),
            type : payload.getType(),
        }
        return await posts.findByIdAndUpdate(_id,{$set : data},{
            runValidators : true,   
            new : true
        })
    }

    return {
        createResource,
        fetchAllData,
        fetchCountAll,
        findDetail,
        findById,
        findByIDandUpdate

    }
}



export default postRepositoriesDB