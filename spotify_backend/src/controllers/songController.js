import { v2 as cloudinary } from 'cloudinary'
import songModel from '../models/songModel.js';


const addSong = async (req, res) => {
    try {
       
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];


        const audioUpload = await cloudinary.uploader.upload(
            audioFile.path,
            { resource_type: "video" }
        );

        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path,
            { resource_type: "image" }
        );


        const totalSeconds = Math.round(audioUpload.duration);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            File: audioUpload.secure_url,
            duration: formattedDuration
        };

        await songModel.create(songData);

        res.json({
            success: true,
            message: "Song uploaded"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const listSong = async (req, res) => {
    try{

        const allSongs = await songModel.find();
        res.json({success:true, songs:allSongs});

    } catch (error) {

        res.json({success:false});
    }
}

const removeSong = async (req, res) => {
    try {
        
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Song removed"});

    } catch (error) {
        res.json({success:false});
    }
}

export { addSong, listSong, removeSong }