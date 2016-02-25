'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Firebase = require('firebase');
const app = express();

const ref = new Firebase('https://minivote.firebaseio.com/');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

const router = express.Router();
const myUpdate = (id, points, obj) => {
    let o = {};
    o[id] = obj;
    o[id].points = points;
    let minivoteRef = ref.child('minivote');
    ref.update(o);
};

// req.params.user_id
router.route('/vote/:imgid')
    .post((req, res) => {

        ref.once('value', function(snapshot) {
            let data = snapshot.val();
            if(data.hasOwnProperty(req.params.imgid)){
                let points = data[req.params.imgid].points;
                myUpdate(req.params.imgid, points+1, data[req.params.imgid]);
            }

        }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code);
        });

        res.json({ message: 'hej hej från bennysBitches servern' });
    })
    .get((req, res) => {
        res.json({ message: 'hej hej från bennysBitches servern' });
    });


router.get('/contestants', function(req, res) {

    ref.once('value', function(snapshot) {
        let data = snapshot.val();
        res.json(data);

    }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
    });

});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to battle system server!' });
});

app.use('/api', router);

const server = app.listen(3334, function() {
    console.log('Listening on port %d', server.address().port);
});
