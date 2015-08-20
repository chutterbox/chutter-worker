var express = require('express');
var router = express.Router();
var webshot = require("webshot");
var AWS = require("aws-sdk");
/* GET users listing. */
router.post('/screencap', function(req, res, next) {
  console.log(req);
  console.log(JSON.stringify(req.body));
  // image_stream = webshot url, profiles[profile]

  // image_buffers = []
  // image_stream.on "data", (buffer) ->
  //   image_buffers.push buffer
  
  // image_stream.on "error", (err) ->
  //   res.reply "Webshot error: " + err
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-west-1'
  });
  sqs = new AWS.SQS();
  res.json(200);
  // aws_akid = process.env.S3_AWS_ACCESS_KEY_ID
  // aws_sk = process.env.S3_AWS_SECRET_ACCESS_KEY
  // aws_region = process.env.S3_AWS_REGION
  // aws_s3_bucket = process.env.WEBSHOT_S3_BUCKET
  // AWS.config.update({accessKeyId: aws_akid, secretAccessKey: aws_sk, region: aws_region});
  // s3bucket = new AWS.S3({params: {Bucket: aws_s3_bucket}})
  // res.send('respond with a resource');
});

module.exports = router;
