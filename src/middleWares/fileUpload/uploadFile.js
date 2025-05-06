const fs = require("fs");
const path = require("path");
const multer = require("multer");

function toFolderName(fieldName) {
  return fieldName
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function createUploader(fieldConfigs = []) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      const fieldName = file.fieldname;
      const folderName = toFolderName(fieldName);
      const uploadPath = path.join(__dirname, "..", "uploads", folderName);

      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) return cb(err, uploadPath);
        cb(null, uploadPath);
      });
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Math.floor(Math.random() * 100000) +
        "_" +
        Date.now() +
        "_" +
        file.originalname;
      cb(null, uniqueName);
    },
  });

  return multer({ storage }).fields(fieldConfigs);
}

// Shortcut utility for single field upload
function dynamicSingleImageUpload(fieldName = "image") {
  return createUploader([{ name: fieldName, maxCount: 1 }]);
}

// For multiple image uploads on one field
function dynamicMultipleImageUpload(fieldName = "images", maxCount = 10) {
  return createUploader([{ name: fieldName, maxCount }]);
}

module.exports = {
  createUploader, // full flexible If you want to upload multiple fields together:
  dynamicSingleImageUpload,
  dynamicMultipleImageUpload,
};
