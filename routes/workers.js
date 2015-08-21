var express = require('express');
var router = express.Router();
var webshot = require("webshot");
var AWS = require("aws-sdk");
var request = require("request");
/* GET users listing. */
router.post('/screencap', function(req, res, next) {
  try{
    var params = JSON.parse(req.body);
    var screencap_url = params.screencap_url;
    var medium_id       = params.medium_id;
    var one_time_key = params.otk;
    console.log(JSON.parse(req.body));
    console.log(screencap_url);
    console.log(one_time_key);
    console.log(medium_id);
    if(screencap_url && one_time_key && medium_id){
      console.log("here");
      var image_stream = webshot(screencap_url);
      var image_buffers = [];
      image_stream.on("data", function(buffer){
          image_buffers.push(buffer);
        }
      )
      image_stream.on("error", function(err){
        res.reply("Webshot error: " + err);
      })

      aws_akid = process.env.S3_AWS_ACCESS_KEY_ID
      aws_sk = process.env.S3_AWS_SECRET_ACCESS_KEY
      aws_region = process.env.S3_AWS_REGION
      aws_s3_bucket = process.env.WEBSHOT_S3_BUCKET
      AWS.config.update({accessKeyId: aws_akid, secretAccessKey: aws_sk, region: aws_region});
      s3bucket = new AWS.S3({params: {Bucket: "chutter-screencaps/uploads"}})
      image_stream.on("end", function(){
        image_data = Buffer.concat(image_buffers);
        params = {Key: (Math.random(1000)+".jpg"), Body: image_data, ContentType: "image/jpg"}
        s3bucket.upload(params, function(err, data){
          if(err){
            res.send("S3 Upload error: " + err);
          }
          else{
            if(medium_id){
              var update_url = 'http://chutter-api.elasticbeanstalk.com/api/v1/media/'+medium_id+'/update_photo?otk='+one_time_key+'&s3_url='+data["Location"];
              request(update_url, function (error, response, body) {
                console.log(error);
              })
            }
            res.send(data["Location"]);
          }
        })
      })
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

});

module.exports = router;
