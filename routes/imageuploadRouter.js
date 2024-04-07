const express = require('express');
const multer  = require('multer');
const mongoose = require('mongoose');

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
    const image = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      userId: req.file.userId
    });
    await image.save();
    res.status(201).send('Image uploaded successfully!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
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

module.exports=app;
