import routers from "../models/routers.js"



const routerRepositoriesDB = () => {

    const createData = async (payload) => {
        return await routers.create({
            model_id: payload.getModelID(),
            model_title: payload.getModelTitle(),
            model_name: payload.getModelName(),
            slug: payload.getSlug(),
        })
    }


    const updateData = async (model_id, payload) => {
        return await routers.findOneAndUpdate(model_id, {
            model_title: payload.getModelTitle(),
            model_name: payload.getModelName(),
            slug: payload.getSlug(),
        }, {
            runValidators: true,
            new: true
        })
    }

    const findOneByQuery = async (query, select = '') => {
        return await routers.findOne(query).select(select).lean().exec()
    }

    return {
        createData, updateData, findOneByQuery
    }
}



export default routerRepositoriesDB