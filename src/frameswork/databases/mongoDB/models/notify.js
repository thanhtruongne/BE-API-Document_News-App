import mongoose, { Schema } from "mongoose";
let notifySchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    url: { type: String, required: true },
    markAread: {
        type: Boolean,
        default: false
    },
    timeMarkRead: {
        type: Date,
        default: null
    },
    type: {
        type: String,
        enum: ['Comment', 'Like', 'Report'],
        default: "Comment",
        index: true
    },
    status: {
        type: String,
        enum: ['Block', 'Pending', 'Send'],
        index: true
    },
}, {
    timestamps: true,
    collection: 'Notify',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



export default mongoose.model('Notify', notifySchema);

