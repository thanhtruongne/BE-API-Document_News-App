import mongoose,{Schema} from "mongoose";
let keyToken = new Schema({
    user : {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        trim: true,
    },   
    publicKey : {
        type:String,
        trim: true
    },
    privateKey: {
        type: String,
        trim: true
    },
},{
    timestamps : true
})

export default mongoose.model('keyTokens',keyToken);   

