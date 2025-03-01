import mongoose, { Schema } from "mongoose";

const RoleAuthorSchema = new Schema({
    title : {
        type:String,
        uniqe: true,
        required : true,
    },   
    status : {
        type:String,
        enum: ['Block', 'Active'],
        default : 'Active'
    },
},{
    timestamps : true
})



export default mongoose.model('roleAuthor',RoleAuthorSchema);   


