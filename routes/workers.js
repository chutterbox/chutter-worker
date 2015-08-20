var express = require('express');
var router = express.Router();
var webshot = require("webshot");
var AWS = require("aws-sdk");
/* GET users listing. */
router.get('/screencap', function(req, res, next) {
  console.log("here here");
  // aws_akid = process.env.S3_AWS_ACCESS_KEY_ID
  // aws_sk = process.env.S3_AWS_SECRET_ACCESS_KEY
  // aws_region = process.env.S3_AWS_REGION
  // aws_s3_bucket = process.env.WEBSHOT_S3_BUCKET
  // AWS.config.update({accessKeyId: aws_akid, secretAccessKey: aws_sk, region: aws_region});
  // s3bucket = new AWS.S3({params: {Bucket: aws_s3_bucket}})
  // res.send('respond with a resource');
});

module.exports = router;
