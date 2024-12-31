import mongoose,{Schema} from "mongoose";
import NestedSetPlugin  from "mongoose-nested-set";
let Categories = new Schema({
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
    description : {
        type:Array,
        required : true,
    },
    thumb : {
        type:String,
    },
},{
    timestamps : true
})

Categories.plugin(NestedSetPlugin);

export default mongoose.model('Categories',Categories);   

