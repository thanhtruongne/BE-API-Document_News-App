import mongoose, { Schema } from "mongoose";
let commentSchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
    full_name: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Block', 'Pending', 'Active'],
        default: 'Pending',
        index: true
    },
    content: { type: String, required: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    // replyCount: {
    //     type: Number,
    //     default: 0
    // },
    level: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    user_likes: [
        { type: Schema.Types.ObjectId, ref: 'Users', default: null },
    ]
}, {
    timestamps: true,
    collection: 'Comment',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


//update level
commentSchema.pre('save', async function (next) {
    if (this.parent_id) {
        try {
            const parent = await this.constructor.findById(this.parent_id);
            if (parent) {
                this.level = (parent.level || 0) + 1;
            } else {
                this.level = 0
            }
        } catch (error) {
            next(error);
        }
    }
    next();
});



// // remove and update level
// commentSchema.pre('remove', async function (next) {
//     if (this.parent_id) {
//         try {
//             await this.constructor.findByIdAndUpdate(
//                 this.parent_id,
//                 { $inc: { replyCount: -1 } }
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//     next();
// });

export default mongoose.model('Comment', commentSchema);

