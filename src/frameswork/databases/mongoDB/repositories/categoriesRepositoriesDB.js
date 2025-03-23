import { omit } from "../../../../utils/index.utils.js";
import categoriesModel from "../models/categories.js";



const categoriesRepositoriesDB = () => {

    const createResource = async(payloadEntities) => {
        return await categoriesModel.create({
            title : payloadEntities.getTitle(),
            description : payloadEntities.getDescription(),
            status : payloadEntities.getStatus(),
            parent_id : payloadEntities.getParentID(),
        })
    }

    const updateResource = async(_id,payloadEntities) => {
        return await categoriesModel.findByIdAndUpdate(_id,{
            title : payloadEntities.getTitle(),
            description : payloadEntities.getDescription(),
            status : payloadEntities.getStatus(),
            parent_id : payloadEntities.getParentID(),
        },{
            new : true,
            runValidators : true
        })
    }


    const findByQueryCate = async(_id,select = {
        title : 1 , description : 2 , status : 3, parent_id : 4 , slug : 5
    }) => {
        return await categoriesModel.findById(_id).select(select).lean().exec()
    }



    const fetchAll = async(params) => {
        return await categoriesModel.find(omit(params,'page','perPage'))
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage)
        .lean()
        .exec()
    }
    


    const fetchAllDataTree = async(parent_id = null,query) => {

        const data =  await categoriesModel.find({parent_id,...query}).select('slug _id parent_id title status')
        .lean()
        .exec()
        .then(res => res.map(({_id,...item},index) => ({ value: _id,key : index , ...item })));

        return Promise.all(data.map(async(item) => ({
           ...item, 
           children : await fetchAllDataTree(item.value,query)
        })))

    }

    const findByQueryAndUpdateMany = async(query,payload) => {
        return await categoriesModel.updateMany(query ,{ $set :payload })
    }

    const changeStatus = async(_id,status) => {
        return await categoriesModel.findByIdAndUpdate({_id},{status},{
            runValidators : true,
            new : true,
            select : '_id status'
        })
    }

    const getDetailResource = async(_id) => {
        return await categoriesModel.findById({_id}).lean().exec();
    }

    const removeResource = async(_id) => {
        return await categoriesModel.findByIdAndDelete({_id})
    }

    const findByQuery = async(query) => {
        return await categoriesModel.find(query).lean().exec()
    }

    const getParentTree = async (parent_id) => {
        if (!parent_id) {
            return [];
        }
        const currentCategory = await categoriesModel.findById(parent_id)
            .select('slug _id parent_id title status')
            .lean()
            .exec();

        if (!currentCategory) {
            return [];
        }

        const formattedCategory = {
            value: currentCategory._id,
            slug: currentCategory.slug,
            title: currentCategory.title,
            status: currentCategory.status,
            parent_id: currentCategory.parent_id
        };

        const parent = await getParentTree(currentCategory.parent_id);
        return [...parent, formattedCategory];
    }


    return {
        createResource,
        updateResource,
        findByQueryCate,
        fetchAll,
        fetchAllDataTree,
        changeStatus,
        removeResource,
        findByQueryAndUpdateMany,
        findByQuery,
        getDetailResource,
        getParentTree,

    }
}



export default categoriesRepositoriesDB