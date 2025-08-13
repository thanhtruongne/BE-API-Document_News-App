import mongoose, { Schema } from "mongoose";

const postLikeSchema = new Schema({
    postId :  {type : mongoose.Types.ObjectId, ref : 'Posts'},   
    userId : {type : mongoose.Types.ObjectId, ref : 'Users'},   
    action : {
        type:String,
        index : true,
        enum: ['Like','Dislike'],
        default : 'Like'
    },
    link : {
        type:Number,
        default: 0,
    }

},{
    timestamps : true
})



postLikeSchema.virtual('toJSON')

export default mongoose.model('PostLikes',postLikeSchema);   


