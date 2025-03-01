import mongoose, { Schema } from "mongoose";
import { generateImageURL } from "../../../../config/cloudinary/uploadResource.js";
import { convertStringSlug } from "../../../../utils/index.utils.js";

const AuthorSchema = new Schema({
    avatar : {
        type:String,
        required : true
    },   
    slug : {
        type:String,
        uniqe:true,
        lowercase:true
    },
    full_name : {
        type:String,
        required : true
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
    role_id: {type: Schema.Types.ObjectId, ref: 'roleAuthor', require : true},
},{
    timestamps : true
})

AuthorSchema.virtual('imageURL').get(function(){
    if (!this.avatar) return null;
    return generateImageURL(this.avatar);
})

AuthorSchema.set('toJSON', { virtuals: true });

AuthorSchema.pre('save', async function(next) {
    this.slug = convertStringSlug(this.full_name) + '-' + Math.floor(Math.random() * 1000000);
    next();

})


export default mongoose.model('authors',AuthorSchema);   


