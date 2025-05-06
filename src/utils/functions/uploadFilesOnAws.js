
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');


exports.convertFileToBase64 = (file) => {
    if (!file || !file.path) return null;
    try {
      const fileData = fs.readFileSync(file.path);
      fs.unlinkSync(file.path); 
      console.log(`File ${file.path} removed after conversion.`);
      return fileData.toString("base64");
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
};


exports.uploadImageOnAwsReturnUrl = async (file)=>{
  if (!file || !file.path) return null;
  try {
    const s3 = new AWS.S3({
      accessKeyId:  process.env.IAM_USER_KEY,
      secretAccessKey:  process.env.IAM_USER_SECRET,
      region: `${process.env.AWS_REGION}` || 'eu-north-1',
    });

    const fileStream = fs.createReadStream(file.path);
    const randomHex = Math.floor(Math.random() * 0x10000000000000000).toString(16); 
    const fileName = `uploads/${Date.now()}_${randomHex}_${path.basename(file.path)}`;
    const mimeType = mime.lookup(fileName) || 'application/octet-stream';
    console.log(process.env.AWS_BUCKET_NAME);
    const uploadParams = {
      Bucket: `${process.env.AWS_BUCKET_NAME}`,
      Key: fileName,
      Body: fileStream,
      ContentType: mimeType
    };

    let data = await s3.upload(uploadParams).promise();
    fs.unlinkSync(file.path); 
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return publicUrl;
  } catch (error) {
    fs.unlinkSync(file.path); 
    console.error("Error reading file:", error);
    return null;
  }

}
