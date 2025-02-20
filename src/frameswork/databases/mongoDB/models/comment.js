import mongoose, { Schema } from "mongoose";
let commentSchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index : true },
    authorId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    full_name: {
        type:String,
        required : false
    },
    status : {
        type:String,
        enum: ['Block','Pending','Approved'],
        default : 'Pending',
        index : true 
    },
    content: { type: String, required: true },
    parent_id: {type: Schema.Types.ObjectId, ref: 'Comment', default : null},
    like : {
        type : Number,
        default : 0
    }
},{ 
    timestamps : true,
    collection: 'Comment'
})




export default mongoose.model('Comment',commentSchema);   

