import { omit } from "../../../../utils/index.utils.js";
import setting from "../models/setting.js";



const settingReposotoriesDB = () => {


    const findAll = async(params) => {
        return await setting.find(omit(params,'page','perPage'))
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage)
        // .lean()
        .exec()
    }

    const storeData = async(_id,payload) => {
        return await setting.findByIdAndUpdate(_id,{
            logo : payload.getLogo(),
            dataJson : payload.getSataJson()
        },{
            new : true,
            upsert : true
        })
    }

    const findDetail = async(_id) => await setting.findById(_id).lean().exec();

    return {
        findAll,
        storeData,
        findDetail
    }
}



export default settingReposotoriesDB