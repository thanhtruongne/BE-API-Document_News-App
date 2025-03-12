import mongoose, { Schema } from "mongoose";

const routerSchema = new Schema({
    model_id :  {type : mongoose.Types.ObjectId, index : true},   
    model_name : {
        type:String,
        required : true,
    },
    model_title : {
        type:String,
        required : true,
    },
    slug : {
        type:String,
        required : true,
    },
    status : {
        type:String,
        enum: ['Block', 'Active'],
        default : 'Active'
    }

},{
    timestamps : true
})



export default mongoose.model('routers',routerSchema);   


