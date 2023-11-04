const fs = require("fs");
const {v4: uuid4 } = require("uuid") ;

const getVideoList = ()=>{
        const videoList = JSON.parse(fs.readFileSync("./data/videos.json"));
        return videoList;
} 

module.exports = {
    getVideoList
};