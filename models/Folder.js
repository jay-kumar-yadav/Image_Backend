const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  path: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure unique folder names per parent per user
folderSchema.index({ name: 1, parent: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);