
const postRepositoriesDB = () => {

    const createResource = async(payloadEntities) => {
        return await postsq .create({
            title : payloadEntities.getTitle(),
            description : payloadEntities.getDescription(),
            content : payloadEntities.getContent(),
            thumb : payloadEntities.getThumb(),
            status : payloadEntities.getStatus(),
            categories_id : payloadEntities.getCategoriesID(),
        })
    }


    // const findByQueryCate = async(_id,select = {
    //     title : 1 , description : 2 , status : 3, parent_id : 4 , slug : 5
    // }) => {
    //     return await categoriesModel.findById(_id).select(select).lean().exec()
    // }


    // const fetchAll = async(params) => {
    //     return await categoriesModel.find(omit(params,'page','perPage'))
    //     .skip(params.perPage * params.page - params.perPage)
    //     .limit(params.perPage)
    //     .lean()
    //     .exec()
    // }


    // const fetchAllDataTree = async(parent_id = null) => {
    //     const data =  await categoriesModel.find({parent_id}).select('slug _id parent_id title status')
    //     .lean()
    //     .exec()
    //     .then(res => res.map(({_id,...item},index) => ({ value: _id,key : index , ...item })));

    //     return Promise.all(data.map(async(item) => ({
    //        ...item,
    //        children : await fetchAllDataTree(item.value)
    //     })))

    // }

    // const changeStatus = async(_id,status) => {
    //     return await categoriesModel.findByIdAndUpdate({_id},{status},{
    //         runValidators : true,
    //         new : true,
    //         select : '_id status'
    //     })
    // }

    // const getDetailResource = async(_id) => {
    //     return await categoriesModel.findById({_id}).lean().exec();
    // }

    // const removeResource = async(_id) => {
    //     return await categoriesModel.findByIdAndDelete({_id})
    // }

    // const findByQuery = async(query) => {
    //     return await categoriesModel.find(query).lean().exec()
    // }


    return {
        createResource,
        // findByQueryCate,
        // fetchAll,
        // fetchAllDataTree,
        // changeStatus,
        // removeResource,
        // findByQuery,
        // getDetailResource
    }
}



export default postRepositoriesDB