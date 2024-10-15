const mongoose = require('../configs/mongo');
const CommunicationSchema = require('../utils/models/communication');

const CommentVersionSchema = new mongoose.Schema(CommunicationSchema.obj);

delete CommentVersionSchema.paths['updatedAt'];

const AdditionSchema = new mongoose.Schema({
    target: {
        type: String,
        required: true,
    },
    originalCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comments',
    },
});
CommentVersionSchema.add(AdditionSchema);

CommentVersionSchema.index({ originalCommentId: 1, createdAt: -1 });

module.exports = mongoose.model('CommentVersions', CommentVersionSchema);