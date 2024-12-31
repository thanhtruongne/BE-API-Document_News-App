import mongoose,{Schema} from "mongoose";
import moment from "moment";

let Posts = new Schema({
    title : {
        type:String,
        required : true
    },   
    slug : {
        type:String,
        required:true,
        uniqe:true,
        lowercase:true
    },
    content : {
        type:Array,
        required : true,
    },
    thumb : {
        type:String,
        required:true,
    },
    description : {
        type:String,
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
    comment : [
        {
            like :{type : Number},
            guest : {type : String},
            createAt : {type : String,default: moment().format('MMMM Do YYYY, h:mm:ss a')},
            postedBy :{type :mongoose.Types.ObjectId ,  ref:'Users'},
            comment : {type :String},
            // report
        }
    ],
    user_id : {
       type : mongoose.Types.ObjectId,
       ref : 'Users'
    }, 
    
},{
    timestamps : true
})



export default mongoose.model('Posts',Posts);   

