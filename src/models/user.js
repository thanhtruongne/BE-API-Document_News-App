import mongoose,{Schema,SchemaType} from "mongoose";


let Users = new Schema({
    full_name : {
        type:String,
        required : true
    },
    email : {
        type:String,
        required : true,
        unique : true
    },
    avatar : {
        type:String,
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
    refreshToken:{
        type:String,
    },
    //Token dùng để gủi qua email của user reset password
    passwordResetToken : {
        type:String
    },
    //Đặt thời gian mặc định cho reset password qua email
    passwordResetExpires : {
        type:String
    },
    dateOfBirth : {
        type: Date
    },
    gender : {
        type:String,
        enum: ['Male','Female','Other'],
    },
    phone : {
        type:String
    },
    address : {
        type:String
    },
    posts : [
        {type : mongoose.Types.ObjectId,ref:'Posts'}
    ]
    
},{
    timestamps : true
})

export default mongoose.model('Users',Users);   

