import mongoose,{Schema} from "mongoose";

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
    },
    thumb : {
        type:String,
    },
    lft: {type: Number, default: 0},
    rgt: {type: Number, default: 0},
    parent_id: {type: Schema.Types.ObjectId, ref: 'categories'},
},{
    timestamps : true
})

export default mongoose.model('categories',Categories);   


