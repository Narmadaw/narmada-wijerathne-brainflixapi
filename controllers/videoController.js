const videoModel = require("../models/videoModel");

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
}

module.exports ={
    getVideoList
}