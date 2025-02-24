import mongoose, { Schema } from "mongoose";
import { convertStringSlug } from "../../../../utils/index.utils.js";

let Posts = new Schema({
    title : {
        type:String,
        required : true,
        index : true
    },   
    slug : {
        type:String,
        // required:true,
        uniqe:true,
        lowercase:true
    },
    content : {
        type: String,
        required : true,
    },
    thumb : {
        type:String,
        required:true,
    },
    description : {
        type:String,
        default : null
    },
    categories_id : {
       type : mongoose.Types.ObjectId,
       ref : 'Categories',
       index : true
    },
    status : {
        type:String,
        enum: ['Block', 'Active'],
        default : 'Active'
    },
    viewed : {
        type: Number,
    },  
    comment : [{  type : mongoose.Types.ObjectId, ref : 'Comment', index : true}],
    user_id : {
       type : mongoose.Types.ObjectId,
       ref : 'Users'
    }, 
    
},{
    timestamps : true
})


Posts.pre('save', async function(next) {
    this.slug = convertStringSlug(this.title);
    const check_exist_slug = await mongoose.model('Posts')
        .findOne({slug : this.slug})
        .select('slug')
        .lean()
        .exec()
    if(check_exist_slug)
        return next(new Api403Error(i18n.translate('error.categories.slug_unique')))
    this.slug = this.slug + '-' + Math.floor(Math.random() * 1000000)
    next();

})


export default mongoose.model('Posts',Posts);   

