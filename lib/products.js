var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server, db;
server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('productdb', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to database");
        db.collection('products', {safe: true}, function (err, collection) {
            if (err) {
                console.log("The collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findAll = function (req, res) {
    db.collection('products', function (err, collection) {
        collection.find().toArray(function (err, items) {
            //res.render('products', {title: 'Products List', items: items});
            res.send(items);
        });
    });
};

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving product: ' + id);
    db.collection('products', function (err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
            res.send(item);
        });
    });
};

exports.addProduct = function (req, res) {
    var product = req.body;
    console.log('Adding product: ' + JSON.stringify(product));
    db.collection('products', function (err, collection) {
        collection.insert(product, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.deleteProduct = function (req, res) {
    var id = req.params.id;
    console.log('Deleting product: ' + id);
    db.collection('products', function (err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred - ' + err});
            } else {
                console.log(' ' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.updateProduct = function (req, res) {
    var id = req.params.id,
        product = req.body;
    console.log('Updating product: ' + id);
    console.log(JSON.stringify(product));
    db.collection('products', function (err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, product, {safe: true}, function (err, result) {
            if (err) {
                console.log('Error updating product: ' + err);
                res.send({'error': 'An error has occurred'});
            } else {
                console.log(' ' + result + ' document(s) updated');
                res.send(product);
            }
        });
    });
};