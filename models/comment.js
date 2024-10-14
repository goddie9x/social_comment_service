const mongoose = require('../configs/mongo');
const CommunicationSchema = require('../utils/models/communication');

const CommentSchema = CommunicationSchema;
const AdditionSchema = new mongoose.Schema({
    target: {
        targetId: {
            type: String,
            required: true,
        },
        targetType: {
            type: Number,
            required: true,
            enum: COMMUNICATION.TARGET_TYPE
        },
    },
});
CommentSchema.add(AdditionSchema);

MessageSchema.index({ 'target.targetId': 1, 'target.targetType': 1, replyTo: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, 'target.targetId': 1, 'target.targetType': 1, createdAt: -1 });

module.exports = mongoose.model('Comments', CommentSchema);