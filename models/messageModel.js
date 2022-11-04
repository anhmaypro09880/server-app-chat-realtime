const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        message: {
            text: { type: String },
            image: {
                type: String,
                default: "",
            },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            default: "unseen",
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Messages", MessageSchema);
