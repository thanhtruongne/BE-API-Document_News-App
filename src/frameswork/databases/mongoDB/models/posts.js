import mongoose, { Schema } from "mongoose";
import { generateImageURL } from "../../../../config/cloudinary/uploadResource.js";
import { convertStringSlug } from "../../../../utils/index.utils.js";

let Posts = new Schema({
    title : {
        type:String,
        required : true,
    },   
    slug : {
        type:String,
        uniqe:true,
        lowercase:true
    },
    type : {
        require : true,
        type : Number,
        comment: '1 là Tin post , 2 là Góc nhìn , 3 là Podcast, 4 là Thể thao ,  5 là Video',
        default : 1
    },
    content : {
        type: String,
        required : true,
    },
    thumb : {
        type:String,
        required:true,
    },
    images : [
        {type : String, require : false}
    ],
    isTrending : {
        type : Boolean,
        default : false,
        comment : "Lưu nếu theo dạng trending"
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

Posts.index({title : 'text'})

Posts.virtual('imageURL').get(function(){
    if (!this.thumb) return null;
    return generateImageURL(this.thumb);
})

Posts.virtual('multipleImageURL').get(function(){
    if (!this.images || this.images[0] == 'undefined') return [];
    return this.images.map((item) => {
        if(item)
            return generateImageURL(item)
    })
})


Posts.set('toJSON', { virtuals: true });

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

