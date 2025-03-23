import mongoose, { Schema } from "mongoose";
import { generateImageURL, generateVideoURL } from "../../../../config/cloudinary/uploadResource.js";
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
        comment: '1 là Tin post , 2 là Infographic , 3 là Podcast, 4 là Thể thao ,  5 là Video',
        default : 1
    },
    media_type : {
        require : true,
        type : Number,
        comment: '1 là Bài viết , 2 là Video , 3 là Chủ đề, 4 là ảnh',
        default : 1
    },
    author_id : { type : mongoose.Types.ObjectId, ref : 'authors', index : true , default : null},
    content : {
        type: String,
        required : true,
    },
    thumb : {
        type:String,
        // required:true,
    },
    videos : {
        type: String,
        required: false,    
        default: null
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
        default : 0
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
Posts.virtual('videoURL').get(function(){
    if (!this.videos) return null;
    return generateVideoURL(this.videos);
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

