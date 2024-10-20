const commentService = require('../services/commentService');
const BasicController = require('../utils/controllers/basicController');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');

class CommentController extends BasicController {
    constructor() {
        super();
        bindMethodsWithThisContext(this);
    }
    async getCommentForPostWithPagination(req, res) {
        try {
            const payloads = {
                id: req.params.id,
                currentUser: req.body.currentUser,
                ...req.query
            }
            const results = await commentService.getCommentsInPostWithReplyAndPagination(payloads);
            return res.status(200).json({ ...results });
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async getCommentById(req, res) {
        try {
            const payloads = {
                id: req.params.id,
                currentUser: req.body.currentUser,
                page: req.query.page,
            }
            const comment = await commentService.getCommentById(payloads);
            
            return res.status(200).json(comment);
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async getCommentsReplyToCommentWithPagination(req, res) {
        try {
            const payloads = {
                id: req.params.id,
                ...req.query,
                currentUser: req.body.currentUser
            }
            const results = await commentService.getCommentsReplyToCommentWithPagination(payloads);
            return res.status(200).json({ ...results });
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async createComment(req, res) {
        try {
            const comment = await commentService.createComment(req.body);

            return res.status(200).json(comment);
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async updateComment(req, res) {
        try {
            const comment = await commentService.updateComment(req.body);

            return res.status(200).json(comment);
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async deleteAllCommentInPost(req, res) {
        try {
            const payloads = {
                id: req.params.id,
                ...req.body,
            }
            await commentService.deleteAllCommentInPost(payloads);

            return res.status(200).json({ message: 'Deleted all comment' });
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async deleteCommentById(req, res) {
        try {
            const payloads = {
                id: req.params.id,
                ...req.body,
            }
            await commentService.deleteCommentById(payloads);
            return res.status(200).json({ message: 'Deleted all comment' });
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
}

module.exports = new CommentController();