import mongoose from "mongoose";
import { timeSince } from "../../../../utils/index.utils.js";

const notificationSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LIKE', 'COMMENT', 'FOLLOW'],
        required: true,
        default: 'LIKE'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    link: {
        type: String,
        required: true
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });

// Virtual field for time ago
notificationSchema.virtual('timeAgo').get(function() {
    return timeSince(this.createdAt);
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
    this.read = true;
    return await this.save();
};

// Method to mark notification as unread
notificationSchema.methods.markAsUnread = async function() {
    this.read = false;
    return await this.save();
};

// Static method to get unread notifications count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({
        recipient: userId,
        read: false,
        isDeleted: false
    });
};

export default mongoose.model('Notification',notificationSchema);   


