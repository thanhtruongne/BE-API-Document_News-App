import mongoose, { Schema } from "mongoose";
import { generateImageURL } from "../../../../config/cloudinary/uploadResource.js";

const settingSchema = new Schema({
    logo : {
        type:String,
        required : true,
    },   
    dataJson : {
        type : String,
        default : null
    }
},{
    timestamps : true
})
settingSchema.virtual('logoURL').get(function(){
    if (!this.logo) return null;
    return generateImageURL(this.logo);
})

settingSchema.set('toJSON', { virtuals: true });


export default mongoose.model('setting',settingSchema);   


