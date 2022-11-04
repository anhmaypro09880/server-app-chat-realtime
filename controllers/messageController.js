const Messages = require("../models/messageModel");
const formidable = require("formidable");
const fs = require("fs");
const messageModel = require("../models/messageModel");
const { log } = require("console");
const aws = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
    accessKeyId: "AKIARYU77JXTDSBHWEG5",
    secretAccessKey: "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",
    region: "us-west-1",
});

const upload = (bucketName) =>
    multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, `image-${Date.now()}.jpeg`);
            },
        }),
    });

module.exports.getMessages = async (req, res, next) => {
    try {
        console.log("getMessages");
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                image: msg.message.image,
                createAt: msg.createdAt,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {
        console.log("addMessage");
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: { text: message, image: "" },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};
module.exports.imageMessageSend = (req, res, next) => {
    console.log("2 send");
};

module.exports.imageMessageSend = (req, res, next) => {
    const form = formidable();
    console.log("Connected to imageMessageSend ");
    var senderNameOut, reseverIdOut;
    form.parse(req, (err, fields, files) => {
        console.log("INto form");
        const { senderName, imageName, reseverId, images, file } = fields;
        senderNameOut = senderName;
        reseverIdOut = reseverId;
        console.log("senderNameOut IN" + senderNameOut);
    });
    console.log("senderNameOut :" + senderNameOut);

    // console.log(req.files);
    // res.status(200).json({ data: req.files });
    const uploadSingle = upload("appchat-picture-profile").single("images");
    console.log(req.formData);

    uploadSingle(req, res, async (err) => {
        // console.log("senderNameOut IntoUpload:" + senderNameOut);
        if (err) {
            console.log("loi :" + err);
        } else {
            console.log("okkk");
            const filePath = req.file.location;
            console.log("OUT" + filePath);

            const insertMessage = await messageModel.create({
                sender: senderNameOut,
                users: [senderNameOut, reseverIdOut],
                message: {
                    text: "",
                    image: req.file.location,
                },
            });
            res.status(200).json({ data: req.file.location });

            // form.parse(req, (err, fields, files) => {
            //     console.log("INto");
            //     const { senderName, imageName, reseverId, images, file } =
            //         fields;
            //     console.log("IN" + filePath);
            //     const newPath =
            //         __dirname +
            //         `../../../client/src/assets/images/${imageName}`;

            //     try {
            //         fs.copyFile(files.image.path, newPath, async (err) => {
            //             if (err) {
            //                 res.status(500).json({
            //                     error: {
            //                         errorMessage: "Image upload fail",
            //                     },
            //                 });
            //             } else {
            //                 const insertMessage = await messageModel.create({
            //                     sender: senderName,
            //                     users: [senderName, reseverId],
            //                     message: {
            //                         text: "",
            //                         image: req.file.location,
            //                     },
            //                 });
            //             }
            //         });
            //     } catch (error) {}
            // });

            // await User.create({ photoUrl: req.file.location });
            // res.status(200).json({ data: req.file.location });
        }
    });

    // form.parse(req, (err, fields, files) => {
    //     const { senderName, imageName, reseverId, images, file } = fields;

    //     const newPath =
    //         __dirname + `../../../client/src/assets/images/${imageName}`;

    //     try {
    //         fs.copyFile(files.image.path, newPath, async (err) => {
    //             if (err) {
    //                 res.status(500).json({
    //                     error: {
    //                         errorMessage: "Image upload fail",
    //                     },
    //                 });
    //             } else {
    //                 const insertMessage = await messageModel.create({
    //                     sender: senderName,
    //                     users: [senderName, reseverId],
    //                     message: {
    //                         text: "",
    //                         image: imageName,
    //                     },
    //                 });
    //             }
    //         });
    //     } catch (error) {}
    // });
};
