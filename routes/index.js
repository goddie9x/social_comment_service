const router = require('express').Router();
const commentController = require('../controllers/commentController');
const mapHealthStatusRoute = require('../utils/eureka/healthStatusRoute');

mapHealthStatusRoute(router);
router.post('/create',commentController.createComment);
router.get('/in-post/:id',commentController.getCommentForPostWithPagination);
router.get('/replies/:id',commentController.getCommentsReplyToCommentWithPagination);
router.patch('/update',commentController.updateComment);
router.post('/delete/id',commentController.deleteCommentById);
router.get('/:id',commentController.getCommentById);

module.exports = router;