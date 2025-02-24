import mongoose, { Schema } from "mongoose";
import i18n from "../../../../config/i18n/i18n.config.js";
import { convertStringSlug } from "../../../../utils/index.utils.js";
import { Api403Error } from "../../../web/plugins/error.response.js";

const Categories = new Schema({
    title : {
        type:String,
        required : true
    },   
    slug : {
        type:String,
        uniqe:true,
        lowercase:true
    },
    description : {
        type:String,
        default : null
    },
    status : {
        type:String,
        enum: ['Block', 'Active'],
        default : 'Active'
    },
    // thumb : {
    //     type:String,
    //     default : null
    // },
    parent_id: {type: Schema.Types.ObjectId, ref: 'categories', default : null},
},{
    timestamps : true
})


Categories.pre('save', async function(next) {
    this.slug = convertStringSlug(this.title);
    const check_exist_slug = await mongoose.model('categories')
        .findOne({slug : this.slug})
        .select('slug')
        .lean()
        .exec()
    if(check_exist_slug)
        return next(new Api403Error(i18n.translate('error.categories.slug_unique')))

    next();

})


export default mongoose.model('Categories',Categories);   


