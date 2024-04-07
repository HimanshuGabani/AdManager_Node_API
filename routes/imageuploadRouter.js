const express = require('express');
const multer  = require('multer');
const mongoose = require('mongoose');
const userModel=require("../models/userModel");

const app = express();

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  userId: String
});

const Image = mongoose.model('Image', imageSchema);

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const id = req.headers.userid;
    const image = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    const userupdate = await userModel.findById(id);

    if(!userupdate) {
      res.status(201).send('User NOt found!');
    }else{
      userupdate.profileImg = image._id;
      await userupdate.save();
    }
    await image.save();
    res.status(201).send('Image uploaded successfully!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/getImage', async (req, res) => {
  try {
    const userId = req.headers.userid;
    const userupdate = await userModel.findById(userId);

    if(!userupdate) {
      res.status(201).send('User NOt found!');
    }
    const image = await Image.findById(userupdate.profileImg);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    // Set the appropriate content type
    res.set('Content-Type', image.contentType);
    // Send the image data
    res.send(image.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/getAll', async (req, res) => {
  try {
    const image = await Image.find();
    console.log({Domo: image});
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.send(image);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.delete('', async (req, res) => {
  try {
    const id = req.body.id;
    const image = await Image.deleteOne({_id:id});
    console.log({Domo: image});
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.send(image);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports=app;
