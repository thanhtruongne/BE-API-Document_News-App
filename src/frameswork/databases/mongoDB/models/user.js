import moment from "moment";
import mongoose, { Schema } from "mongoose";
import { generateImageURL } from "../../../../config/cloudinary/uploadResource.js";
let Users = new Schema({
    full_name : {
        type:String,
        default: null
    },
    email : {
        type:String,
        required : true,
        unique : true,
        index : true
    },
    avatar : {
        type:String,
        default : null
    },
    password : {
        type:String,
        required : true
    },
    status : {
        type:String,
        enum: ['Block', 'Active','Deleted'],
        default : 'Active'
    },
    //Token dùng để gủi qua email của user reset password
    passwordResetToken : {
        type:String,
        default : null
    },
    //Đặt thời gian mặc định cho reset password qua email
    passwordResetExpires : {
        type:String,
        default : null
    },
    dateOfBirth : {
        type: Date,
        default : null
    },
    gender : {
        type:String,
        enum: ['Male','Female','Other'],
        required : false    
    },
    phone : {
        type:String,
        default : null
    },
    address : {
        type:String,
        default : null
    },
    role : {
        type : String,
        enum : ['User','Admin'],
        default : "User"
    },
    post_saves : [
        {type : mongoose.Types.ObjectId,ref:'Posts'}
    ],
    post_likes : [
        {type : mongoose.Types.ObjectId,ref:'Posts'}
    ],
    
},{
    timestamps : true
})

Users.virtual('formatCreatedAt').get(function () {
    return moment(this.createdAt).fromNow(); 
});


Users.virtual('imageURL').get(function(){
    if (!this.avatar) return null;
    return generateImageURL(this.avatar);
})
  
// Users.set('toJSON', { virtuals: true });

Users.set('toJSON', { virtuals: true, transform : function (doc, ret) {
    ret.id = ret._id; 
    delete ret._id;   
} });
Users.set('toObject', { virtuals: true,transform : function (doc, ret) {
    ret.id = ret._id; 
    delete ret._id;  
} });

export default mongoose.model('Users',Users);   

