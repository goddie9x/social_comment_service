const mongoose = require('../configs/mongo');
const CommunicationSchema = require('../utils/models/communication');

const CommentSchema = new mongoose.Schema(CommunicationSchema);

const AdditionSchema = new mongoose.Schema({
    target: {
        type: String,
        required: true,
    },
});
CommentSchema.add(AdditionSchema);

CommentSchema.index({ target: 1, replyTo: 1, createdAt: -1 });
CommentSchema.index({ replyTo: 1, createdAt: -1 });
CommentSchema.index({ sender: 1, target: 1, createdAt: -1 });

module.exports = mongoose.model('Comments', CommentSchema);