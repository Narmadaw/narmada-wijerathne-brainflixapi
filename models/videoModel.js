const fs = require("fs");

const videoListsJSON = () =>{
    return fs.readFileSync("./data/videos.json");
}


const getVideoList = ()=>{
    const videoList = JSON.parse(videoListsJSON());
    return videoList;
} 

const getVideoById = (videoId) => {
    const videos = JSON.parse(videoListsJSON());
    const foundVideo = videos.find((video) => video.id === videoId);
    return foundVideo;
};

function postVideo(newVideo) {
    const videoList = JSON.parse(videoListsJSON());
    videoList.push(newVideo);
    fs.writeFile("./data/videos.json", JSON.stringify(videoList, null, 2));
};

const postComment = (videoId, newComment, callback) => {
    const videoList = JSON.parse(videoListsJSON());
    const selectedVideo = videoList.find((video) => video.id === videoId);
    if (selectedVideo) {
        selectedVideo.comments = selectedVideo.comments ?? [];
        selectedVideo.comments.push(newComment);
        fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
        callback(null, selectedVideo.comments);
      } else {
        callback("Video does not exist", null);
      }
};

const likeComment = (videoId, commentId) =>{
    const videoList = JSON.parse(videoListsJSON());
    const selectedVideo = videoList.find((video) => video.id === videoId);
    if (selectedVideo) {
        if (Array.isArray(selectedVideo.comments)) {
          const commentToUpdate = selectedVideo.comments.find(comment => comment.id === commentId);
          if (commentToUpdate) {
            commentToUpdate.likes += 1;
            fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
            return "Comment likes updated successfully";
          } else {
            return "Comment not found";
          }
        }
    }
}

const deleteComment = (videoId, commentId) =>{
    const videoList = JSON.parse(videoListsJSON());
    const selectedVideo = videoList.find((video) => video.id === videoId);
    if (!selectedVideo) {
        return 'Video not found';
      }
      if (!Array.isArray(selectedVideo.comments)) {
        return 'No comments found for this video';
      }
      const commentIndex = selectedVideo.comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) {
        return 'Comment not found';
      }
      selectedVideo.comments.splice(commentIndex, 1);
      fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
      return 'Comment deleted successfully';
}

module.exports = {
    getVideoList,
    getVideoById,
    postVideo,
    postComment,
    likeComment,
    deleteComment
};