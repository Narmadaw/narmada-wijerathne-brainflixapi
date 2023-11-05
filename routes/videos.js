const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

router.get("/", videoController.getVideoList);
router.get("/:id", videoController.getVideoById);
router.post("/", videoController.postVideo);
router.post("/:id/comments", videoController.postComment);
router.put("/:id/comments/:commentId", videoController.likeComment);
router.delete("/:id/comments/:commentId", videoController.deleteComment);


module.exports = router;