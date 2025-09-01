import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true // adds createdAt & updatedAt
}
)

const PlayList = mongoose.model("PlayList", playListSchema);

export { PlayList };