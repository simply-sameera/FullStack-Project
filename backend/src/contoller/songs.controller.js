const uploadFile = require("../storage/song.storage")
const songModel=require("../model/songs.model")

const createSong=async (req,res)=>{
    const {title,artist,mood}=req.body
    const data1=req.files

    // console.log(data)
    console.log(data1) // array of object
    for(let i=0;i<data1.length;i++){
        const fileData=await uploadFile(data1[i]);
        console.log(fileData.url);

        const song=await songModel.create({
            title:title,
            artist:artist,
            mood:mood,
            audioFile:fileData.url
        })
    }
    res.json({
        message:"Song Created"
    })
}

const allSongs=async (req,res)=>{
    const all=await songModel.find()
    res.json({
        message:"All Songs Fetched",
        all
    })
}

module.exports={createSong,allSongs}