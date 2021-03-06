var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    ObjectID = mongo.ObjectID;

//mongodb://<user>:<password>@linus.mongohq.com:10013/todomap
//mongodb://<dbuser>:<dbpassword>@ds047037.mongolab.com:47037/todomap

//var server = new Server('ds047037.mongolab.com', 47037, { auto_reconnect: true });
//var db = new Db('todomap', server, {native_parser:false});

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('todomap', server, {native_parser:false});


db.open(function(err, db) {
    console.log("Connecting to DB");
    if (err) {
        console.log("Connection failed: " + err);
    } else {
        console.log("Connecting to DB done");
    }
    
    db.authenticate( "todoapp", "todoapp", function( err, result){ 
        console.log("Authentication to DB");
        if(err){
            console.log("Authentication failed: " + err);
        } else {
            console.log("Authentication to DB done");
        }
    });
});



exports.findById = function(req, res) {
    var id = req.params.id;
    
    console.log('Loading map: ' + id);
    
    db.collection('maps', function(err, collection) {
        if(err) throw err;
        collection.findOne(
            {'_id': new BSON.ObjectID(id)}, 
            function(err, item) {
                if(err) {
                    console.log('Loading map err: ' + err);
                    res.json( 500, {'message':'An error has occurred while loading the map', 'error': err});
                } else {
                    console.log('Loading succeed');
                    // console.log( 'Map: ' + JSON.stringify( item));
                    res.send(item);
                }
            }
        );
    });
};

exports.updateById = function(req, res) {
    var id = req.params.id;
    var map = req.body;

    delete map._id;
    // map._id = new ObjectID.createFromHexString( map._id);
    
    console.log( 'Updating map: ' + id);
    // console.log( 'Map: ' + JSON.stringify( map));
    
    db.collection('maps', function(err, collection) {
        if(err) throw err;
        collection.update(
            {'_id': new BSON.ObjectID(id)}, map, {safe:true}, 
            function(err, result) {
                if (err) {
                    console.log('Updating map err: ' + JSON.stringify( err));
                    res.json( 500, {'message':'An error has occurred while updating the map', 'error': err});
                } else {
                    console.log('Updating succeed');
                    res.send(map);
                }
            }
        );
    });
};
