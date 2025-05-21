const defaultMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

function validateUpload({
  fieldName = "file",
  multiple = false,
  type = "image", // "image", "video", or "both"
  required = true,
} = {}) {
  return (req, res, next) => {
    const files = req.files?.[fieldName];

    if (required && (!files || files.length === 0)) {
      return res.status(400).json({
        message: `File${multiple ? "s" : ""} required for "${fieldName}".`,
      });
    }

    if (files && files.length > 0) {
      let allowed = [];

      if (type === "image") allowed = defaultMimeTypes.image;
      else if (type === "video") allowed = defaultMimeTypes.video;
      else if (type === "both")
        allowed = [...defaultMimeTypes.image, ...defaultMimeTypes.video];

      for (const file of files) {
        if (!allowed.includes(file.mimetype)) {
          return res.status(400).json({
            message: `Invalid file type for "${fieldName}". Allowed: ${allowed.join(", ")}`,
          });
        }
      }
    }

    next();
  };
}

module.exports = {validateUpload};
