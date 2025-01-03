import i18n from "../configs/i18n.config.js";
import { Api403Error,Api401Error, Api404Error,BusinessLogicError } from "../core/error.response.js";
import categoriesModel from "../models/categories.model.js";
import { getSelectData } from "../utils/index.utils.js";
import validator from 'validator'
import { convertToObject } from "../utils/index.utils.js";


class CategoriesService {
    async saveData({ title,slug,description,thumb,_id = null, parentId = null}) {               
        
        if(!validator.isEmpty(_id) && _id != null) { // save data check value
            let model = categoriesModel.findOne({_id}).lean();
            if(!model) throw new Api401Error(i18n.translate('error.not_found.data'))

        } else {
            const model = new categoriesModel({title,slug,description,thumb,parentId})
        }

        let rightValue = 0
        if (parentId) {
            // reply comment
            const parentCate = await categoriesModel.findById(parentId)
            if (!parentCate) throw new Api404Error(i18n.translate('key.nestedset.parent.not_found'))

            rightValue = parentCate.rgt

            // rgt
            await categoriesModel.updateMany({
                rgt: { $gte: rightValue}
            }, {
                $inc: {rgt: 2}
            })
            // lft
            await categoriesModel.updateMany({
                lft: { $gt: rightValue}
            }, {
                $inc: {lft: 2}
            })
        } else {
            const maxRightValue = await categoriesModel.findOne({_id}, 'rgt', {sort: {rgt: -1}})
            if (maxRightValue) {
                rightValue = maxRightValue.rgt + 1
            } else {
                rightValue = 1
            }
        }

        model.lft = rightValue;
        model.rgt = rightValue + 1;
        model.title = title;
        model.description = description;
        model.thumb = thumb;

        await model.save()
        return comment
    }

}


export default new CategoriesService();