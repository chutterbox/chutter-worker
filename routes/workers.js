var express = require('express');
var router = express.Router();
var webshot = require("webshot");
var AWS = require("aws-sdk");
var request = require("request");


/* GET users listing. */
router.post('/screencap', function(req, res, next) {
  try{

    //parse all params
    var params = JSON.parse(req.body);
    console.log("Params: " + params + "\n\n");
    var screencap_url = params.screencap_url;
    var medium_id       = params.medium_id;
    var one_time_key = params.otk;
    console.log("Screencap Url " + screencap_url + "\n\n");
    console.log("Medium Id " + medium_id + "\n\n");
    console.log("One Time Key " + one_time_key + "\n\n");
    if(screencap_url && one_time_key && medium_id){
      console.log("fetching webshot \n\n");
      var image_stream = webshot(screencap_url);
      var image_buffers = [];
      image_stream.on("data", function(buffer){
          image_buffers.push(buffer);
        }
      )
      image_stream.on("error", function(err){
        console.log("Error: " + err + "\n\n");
        res.sendStatus(500);
      })
      aws_akid = process.env.S3_AWS_ACCESS_KEY_ID
      aws_sk = process.env.S3_AWS_SECRET_ACCESS_KEY
      aws_region = process.env.S3_AWS_REGION
      AWS.config.update({accessKeyId: aws_akid, secretAccessKey: aws_sk, region: aws_region});
      s3bucket = new AWS.S3({params: {Bucket: "chutter-screencaps/uploads"}})
      image_stream.on("end", function(){
        image_data = Buffer.concat(image_buffers);
        params = {Key: ("screencap-"+medium_id+".jpg"), Body: image_data, ContentType: "image/jpg"}
        s3bucket.upload(params, function(err, data){
          if(err){
            console.log("S3 upload err: " + err + "\n\n");
            res.sendStatus(500);
          }
          else{
            console.log("Image uploaded at: " + data["Location"] + "\n\n");
            var update_url = 'http://chutter-api.elasticbeanstalk.com/api/v1/media/'+medium_id+'/update_photo?otk='+one_time_key+'&s3_url='+data["Location"];
            request(update_url, function (error, response, body) {
              console.log(error);
            })
            res.sendStatus(200);
          }
        })
      })
    } else {
      console.log("params were missing");
      res.sendStatus(500);
    }
  } catch (err) {
    console.log("error: " + err);
    res.sendStatus(500);
  }

});

module.exports = router;
