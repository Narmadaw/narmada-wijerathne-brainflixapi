const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


/***************************************************
 * ROUTE:GET MIMIC VIDEO LIST
 ***************************************************/
router.get("/", (_req, res) => {
  const videoListsJSON = fs.readFileSync("./data/videos.json");
  const videoList = JSON.parse(videoListsJSON);
  const mimicVideoList = videoList.map(video =>{
    return{
      id: video.id,
      title: video.title,
      image: video.image,
      channel:video.channel
    };
  });
  res.send(mimicVideoList);
});

/******************************************************
 * ROUTE: GET SELECTED VIDEO DETAILS BY ID
 ******************************************************/
router.get("/:id", (req, res)=> {
  const { id } = req.params;
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);
  const foundVideo = videos.find((video)=> video.id === id);
  if(foundVideo){
      res.send(foundVideo);
  } else {
      res.status(400).send("comment does not exist")
  }
});

/*******************************************************
 *ROUTE: POST NEW VIDEO
 *******************************************************/
router.post("/", upload.single('image'), (req, res) => {
  try {
    const videoListsJSON = fs.readFileSync("./data/videos.json");
    const videoList = JSON.parse(videoListsJSON);
    const newVideo = {
      id: uuidv4(),
      title: req.body.title,
      channel: "The Music Channel",
      image: req.file.filename, 
      description: req.body.description,
      views: 0,
      likes: 0,
      duration: "4:20",
      video: "Sample-Video.mp4",
      timestamp: Date.now(),
      comments: []
    };
    videoList.push(newVideo);
    fs.writeFile('./data/videos.json', JSON.stringify(videoList, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save video data' });
      }
      res.status(201).json({ message: 'Video uploaded and data saved' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/*************************************************************
 * ROUTE: POST NEW COMMENTS
 *************************************************************/
router.post("/:id/comments", (req, res) => {
  const videoListsJSON = fs.readFileSync("./data/videos.json");
  const videoList = JSON.parse(videoListsJSON);
  const { id } = req.params;
  const newComment = req.body;
  const selectedVideo = videoList.find(video => video.id === id);
  if (selectedVideo) {
    if (!Array.isArray(selectedVideo.comments)) {
      selectedVideo.comments = [];
    }
    selectedVideo.comments.push(newComment);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
    res.send(selectedVideo.comments);
  } else {
    res.status(404).send("Video does not exist");
  }
});

/******************************************************
 * ROUTE: PUT LIKES
 ******************************************************/
router.put("/:id/comments/:commentId", (req, res)=>{
  const videoListsJSON = fs.readFileSync("./data/videos.json");
  const videoList = JSON.parse(videoListsJSON);
  const { id, commentId } = req.params;
  const selectedVideo = videoList.find(video => video.id === id);
  if (selectedVideo) {
    if (Array.isArray(selectedVideo.comments)) {
      const commentToUpdate = selectedVideo.comments.find(comment => comment.id === commentId);
      if (commentToUpdate) {
        commentToUpdate.likes += 1;
        fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
        res.send("Comment likes updated successfully");
      } else {
        res.status(404).send("Comment not found");
      }
    } else {
      res.status(404).send("No comments found for this video");
    }
  } else {
    res.status(404).send("Video not found");
  }
});

/*******************************************************
 * ROUTE: DELETE COMMENTS
 *******************************************************/
router.delete("/:id/comments/:commentId", (req, res) => {
  const videoListsJSON = fs.readFileSync("./data/videos.json");
  const videoList = JSON.parse(videoListsJSON);
  const { id, commentId } = req.params;
  const selectedVideo = videoList.find(video => video.id === id);
  if (selectedVideo) {
    if (Array.isArray(selectedVideo.comments)) {
      const commentIndex = selectedVideo.comments.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        selectedVideo.comments.splice(commentIndex, 1);
        fs.writeFileSync("./data/videos.json", JSON.stringify(videoList, null, 2));
        res.send("Comment deleted successfully");
      } else {
        res.status(404).send("Comment not found");
      }
    } else {
      res.status(404).send("No comments found for this video");
    }
  } else {
    res.status(404).send("Video not found");
  }
});

module.exports = router;