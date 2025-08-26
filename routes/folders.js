const express = require('express');
const { createFolder, getFolders, getFolderPath, getFolder } = require('../controllers/folderController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.post('/', createFolder);
router.get('/', getFolders);
router.get('/:folderId/path', getFolderPath);
router.get('/:id', getFolder); // Add this new route

module.exports = router;