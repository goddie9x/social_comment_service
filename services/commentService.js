const Comment = require('../models/comment');
const CommentVersion = require('../models/commentVersion');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');
const BasicService = require('../utils/services/basicService');
const { TargetNotExistException, BadRequestException } = require('../utils/exceptions/commonExceptions');
const { sendCreateNotificationKafkaMessage } = require('../utils/kafka/producer');
const { TYPE } = require('../utils/constants/notification');
const { GEN_POST_ROUTE_WITH_COMMENT } = require('../utils/constants/clientRoute');
class CommentService extends BasicService {
    constructor() {
        super();
        bindMethodsWithThisContext(this);
    }
    async getCommentReplyOfListComment(comments) {
        if (!comments) {
            throw new TargetNotExistException('Comments not exist');
        }
        const commentWithReplies = await Promise.all(comments.map(async (comment) => {
            const { results: replies, totalDocuments: totalReplies, totalPages: totalReplyPages } = await this.getPaginatedResults({
                model: Comment,
                query: {
                    replyTo: comment._id
                }
            });
            return {
                ...comment.toObject(),
                replies,
                totalReplies,
                currentReplyPage
            }
        }));
        return commentWithReplies;
    }
    /*TODO: we must validate that current user (not admin or mod) can read the post:
         - if the post in a group, user are not in the group and the group privacy must public,
         - if the post in user profile:
            + Private post current user must be post owner
            + Post custom like friend so that current user must be friend of the post owner
        */
    async getCommentsInPostWithReplyAndPagination(payloads) {
        const { id, page, limit, currentUser } = payloads;
        const { results: comments, totalDocuments: totalComment, totalPages } = await this.getPaginatedResults({
            model: Comment,
            query: {
                target: id
            },
            page,
            limit,
        });
        const commentWithReplies = await this.getCommentReplyOfListComment(comments);

        return {
            totalComment,
            commentWithReplies,
            totalComment,
            totalPages
        };
    }
    async getCommentsReplyToCommentWithPagination(payloads) {
        const { id, page, limit, currentUser } = payloads;
        const { results: comments, totalDocuments: totalComment, totalPages } = await this.getPaginatedResults({
            model: Comment,
            query: {
                replyTo: id
            },
            page,
            limit,
        });
        const commentWithReplies = await this.getCommentReplyOfListComment(comments);

        return {
            totalComment,
            commentWithReplies,
            totalComment,
            totalPages
        };
    }
    //TODO: validate that user can read that comment base on post, user,...
    async getCommentById(payloads) {
        const { id, currentUser } = payloads;
        const comment = await Comment.findById(id);
        if (!comment) {
            throw new TargetNotExistException('Comment not exist');
        }
        return comment;
    }
    //TODO: validate that user can comment in the post
    async createComment(payloads) {
        const { currentUser, createdAt, target, sender, replyTo, content, contentType } = payloads;
        //TODO get post for validate can comment and 
        const comment = new Comment({
            target,
            sender: currentUser.userId,
            replyTo,
            content,
            contentType
        });
        const response = await comment.save();

        if (comment.replyTo) {
            const targetComment = await Comment.findById(comment.replyTo);
            if (!targetComment) {
                throw new TargetNotExistException('The comment that you reply to is not exist');
            }
            sendCreateNotificationKafkaMessage({
                target: targetComment.sender.toString(),
                type: TYPE.COMMENT,
                content: `User ${currentUser.userId} has replied to your comment`,
                href: GEN_POST_ROUTE_WITH_COMMENT(comment.target, targetComment._id.toString())
            });
        }
        else {
            //TODO: push notification to owner post
        }
        return comment;
    }
    async updateComment(payloads) {
        const { id, currentUser, content, contentType } = payloads;
        const comment = await Comment.findById(id);
        if (!comment) {
            throw new TargetNotExistException('The comment not exist');
        }
        const commentVersion = new CommentVersion({ originalCommentId: comment._id, ...comment.toObject() });
        comment.content = content;
        comment.contentType = contentType;
        await comment.save();
        await commentVersion.save();
        return comment;
    }
    async getVersionsOfComment(payloads) {
        const { id, currentUser } = payloads;
        //TODO validate that user can read the comment
        const commentVersions = await CommentVersion.find({
            originalCommentId: id
        });
        return commentVersions;
    }
    async deleteAllCommentInPost(payloads) {
        const { id, currentUser } = payloads;
        //TODO check post exist -> check current user can delete comment if the user is the owner or admin or mod
        if (!id) {
            throw BadRequestException('Post not provided');
        }
        const commentIds = await Comment.find({
            target: id
        }, '_id');
        const commentIdsToDelete = commentIds.map(x => x._id);
        await CommentVersion.deleteMany({
            originalCommentId: { $in: commentIdsToDelete }
        });
        await Comment.deleteMany({
            _id: { $in: commentIdsToDelete }
        });
    }
    async deleteCommentById(payloads) {
        const { id, currentUser } = payloads;
        await this.deleteCommentCascade(id);
    }
    async deleteCommentCascade(commentId) {
        const allCommentIds = await gatherRelatedComments(commentId);

        await Comment.deleteMany({ _id: { $in: allCommentIds } });
        await CommentVersion.deleteMany({ originalCommentId: { $in: allCommentIds } });
    }

    async gatherRelatedComments(commentId) {
        let idsToDelete = [commentId];
        let queue = [commentId];

        while (queue.length > 0) {
            const currentId = queue.shift();

            const replies = await Comment.find({ replyTo: currentId }, '_id');

            if (replies.length > 0) {
                const replyIds = replies.map(reply => reply._id);
                idsToDelete.push(...replyIds);
                queue.push(...replyIds);
            }
        }

        return idsToDelete;
    }
}

module.exports = new CommentService();