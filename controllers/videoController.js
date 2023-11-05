const {v4: uuidv4 } = require("uuid") ;
const videoModel = require("../models/videoModel");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });


const getVideoList = (_req, res) => {
    try{
        const videoList = videoModel.getVideoList();
        const mimicVideoList = videoList.map((video) =>{
            return{
                id: video.id,
                title: video.title,
                image: video.image,
                channel: video.channel,
            };
        });
        res.send(mimicVideoList);
    }catch(error){
        return res.status(400).send(error.message);
    }
};

const getVideoById = (req, res) => {
    try {
      const { id } = req.params;
      const foundVideo = videoModel.getVideoById(id);
      if (foundVideo) {
        res.send(foundVideo);
      } else {
        res.status(400).send(error.message);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
};

const saveImage = upload.single('image');
const postVideo = (req, res) => {
    try {
      const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        channel: "Test Channel",
        image: req.file.filename,
        description: req.body.description,
        views: 0,
        likes: 0,
        duration: "4:20",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: Date.now(),
        comments: [],
      };
      videoModel.postVideo(newVideo);
    } catch (error) {
      res.status(500).json(error.message);
    }
};

const postComment = (req, res) =>{
  try{
    const { id } = req.params;
    const newComment ={
      id: uuidv4(),
      name: req.body.name,
      comment: req.body.comment,
      likes:0,
      timestamp: Date.now(),
    }
    videoModel.postComment(id, newComment, (error, updatedComments) =>{
      if (error) {
        res.status(500).send('Internal Server Error');
      } else {
        res.send(updatedComments);
      }
    })

  }catch(error){
    res.send(error);
  }
};

const likeComment = (req, res) =>{
    const { id, commentId  } = req.params;
    videoModel.likeComment(id, commentId);
};

const deleteComment = (req, res) => {
    const { id, commentId } = req.params;
    const response = videoModel.deleteComment(id, commentId);
  
    if (response === 'Comment deleted successfully') {
      res.send(response);
    } else {
      res.status(404).send(response);
    }
};



module.exports ={
    getVideoList,
    getVideoById,
    postVideo,
    postComment,
    likeComment,
    deleteComment
}