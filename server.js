var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var port = 8088;
var router = express.Router();
var Bear = require('./models/bear.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears', {
    useNewUrlParser: true
});
router.use(function (req, res, next) {
    console.log("middleware");
    next();
})
router.route('/bears')
    .post(function (req, res) {
        var bear = new Bear();
        console.log(req.body);
        
        bear.name = req.body.name;
        bear.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({
                message: 'bear created'
            })
        })
    })
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err) {
                return res.send(err);
            }
            res.json(bears);
        })
    })

router.route('/bears/:bear_id')
    .get(function(req,res){
        Bear.findById(req.params.bear_id,function(err,bears){
            if(err){
                return res.send(err);
            }
            res.json(bears);
        });
    })
    .put(function(req,res){
        Bear.findById(req.params.bear_id,function(err,bear){
            if(err){
                return res.send(err);
            }
            bear.name=req.body.name;
            bear.save(function(err){
                if(err){
                    return res.send(err);
                }
                res.send({msg:"successfully updated"})
            })
        })
    })
    .delete(function(req,res){
        Bear.remove({
            _id:req.params.bear_id
        },function(err,bear){
            if(err){
                res.send(err)
            }
            else{
                res.json({message:'successfully deleted'});
            }
        })
    })

// router.post('/bears', function (req, res) {
//     var bear = new Bear();
//     bear.name = req.body.name;
//     bear.save(function (err) {
//         if (err) {
//             return res.send(err);
//         }
//         res.json({
//             message: 'bear created'
//         })
//     })
// })
router.get('/', function (req, res) {
    console.log("router")
    res.json({
        message: 'hi dude welcome to api'
    });
});

app.use('/api', router);
app.listen(port, function () {
    console.log("success", port);
});