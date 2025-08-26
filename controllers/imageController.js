const Image = require('../models/Image');
const Folder = require('../models/Folder');

const uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const owner = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    let folder = null;
    if (folderId) {
      folder = await Folder.findOne({ _id: folderId, owner });
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
    }

    const image = await Image.create({
      name,
      filename: req.file.filename,
      path: req.file.path,
      folder: folderId || null,
      owner
    });

    res.status(201).json(image);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Image with this name already exists in this folder' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const getImages = async (req, res) => {
  try {
    const { folderId } = req.query;
    const owner = req.user._id;

    const query = { owner };
    if (folderId) {
      query.folder = folderId;
    } else {
      query.folder = null;
    }

    const images = await Image.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchImages = async (req, res) => {
  try {
    const { query } = req.query;
    const owner = req.user._id;

    const images = await Image.find({
      owner,
      name: { $regex: query, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage, getImages, searchImages };