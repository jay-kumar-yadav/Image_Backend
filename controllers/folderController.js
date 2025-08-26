const Folder = require('../models/Folder');

const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const owner = req.user._id;

    let path = name;
    let parent = null;

    if (parentId) {
      parent = await Folder.findOne({ _id: parentId, owner });
      if (!parent) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      path = `${parent.path}/${name}`;
    }

    const folder = await Folder.create({
      name,
      parent: parentId || null,
      owner,
      path
    });

    res.status(201).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Folder with this name already exists in this location' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const getFolders = async (req, res) => {
  try {
    const { parentId } = req.query;
    const owner = req.user._id;

    const query = { owner };
    if (parentId) {
      query.parent = parentId;
    } else {
      query.parent = null;
    }

    const folders = await Folder.find(query).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFolderPath = async (req, res) => {
  try {
    const { folderId } = req.params;
    const owner = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, owner });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Get all folders in the path
    const pathParts = folder.path.split('/');
    const breadcrumb = [];

    // Create a proper breadcrumb with folder IDs
    let currentFolder = folder;
    const pathItems = [];
    
    while (currentFolder) {
      pathItems.unshift({
        id: currentFolder._id,
        name: currentFolder.name
      });
      
      if (currentFolder.parent) {
        currentFolder = await Folder.findById(currentFolder.parent);
      } else {
        currentFolder = null;
      }
    }

    res.json(pathItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get folder by ID
const getFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;

    const folder = await Folder.findOne({ _id: id, owner });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFolder, getFolders, getFolderPath, getFolder };