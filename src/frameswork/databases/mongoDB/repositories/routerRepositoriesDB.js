import routers from "../models/routers.js"



const routerRepositoriesDB = () => {
    
    const createData = async(payload) => {
        return await routers.create({
            model_id : payload.getModelID(),
            model_title : payload.getModelTitle(),
            model_name : payload.getModelName(),
            slug : payload.getSlug(),
        })
    }


    const updateData = async(id,payload) => {
        return await routers.findOneAndUpdate({model_id : id}, {
            model_title : payload.getModelTitle(),
            model_name : payload.getModelName(),
            slug : payload.getSlug(),
        },{
            runValidators : true,   
            new : true
        })
    }

    const findOneByQuery = async(query) => {
        return await routers.findOne(query).lean().exec()
    }
    
    return {
        createData,updateData,findOneByQuery
    }
}



export default routerRepositoriesDB