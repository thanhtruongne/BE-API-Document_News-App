import mongoose,{Schema} from "mongoose";
let podCasts = new Schema({
    title : {
        type : String,
        require:true,
        trim: true,
    },   
    content : {
        type : String,
        require:true,
        trim: true,
    },
    author: {   
        type: String,
        require:true,
        trim: true
    },
    audio: {
        type: String,
        require:true,
    },
    comment : [
        {
            like :{type : Number},
            guest : {type : String},
            createAt : {type : String,default: moment().format('MMMM Do YYYY, h:mm:ss a')},
            postedBy :{type :mongoose.Types.ObjectId ,  ref:'Users'},
            comment : {type :String},
            approved : {
                type : Number,
                enum: [1,2,3],
                default : 1
            }
        }
    ],
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
},{
    timestamps : true,
    collection: 'podCasts'
})

export default mongoose.model('podCasts',podCasts);   

