import { omit } from "../../../../utils/index.utils.js";
import authors from "../models/authors.js";
import role from "../models/role.js";


const auhthorRepositoriesDB = () => {

    const createResourceAuthor = async(payloadEntities) => {
        return await authors.create({
            full_name : payloadEntities.getFullName(),
            description : payloadEntities.getDescription(),
            status : payloadEntities.getStatus(),
            role_id : payloadEntities.getRoleID(),
            avatar : payloadEntities.getAvatar()
        })
    }

    const getAllDataAuthor = async(params) => {
        return await authors.find(omit(params,'page','perPage','select'))
        .select(params.select)  
        .skip(params.perPage * params.page - params.perPage)
        .populate({
            path : "role_id",
            select : "title _id status",
        })
        .limit(params.perPage)
        // .lean()
        // .exec()
    }

    const countAllDataAuthor = async(params) => await authors.countDocuments(omit(params,'page','select','perPage'))





    //roleAuthor
    const createResourceRoleAuthor = async(payloadEntities) =>  await role.create({
        title : payloadEntities.getTitle(),
        status : payloadEntities.getStatus()
    })

    const getAllDataRoleAuthor = async(params) => {
        return await role.find(omit(params,'page','perPage','select'))
        .select(params.select)  
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage)
        .lean()
        .exec()

    }

    const countAllDataRoleAuthor = async(params) => await role.countDocuments(omit(params,'page','perPage','select'))

    const findRoleAuthorByQuery = (query) => {
        return role.find(query).lean().exec();
    }

    return {
        createResourceAuthor,
        getAllDataAuthor,
        countAllDataAuthor,
        createResourceRoleAuthor,
        getAllDataRoleAuthor,
        countAllDataRoleAuthor,
        findRoleAuthorByQuery
    }
}



export default auhthorRepositoriesDB