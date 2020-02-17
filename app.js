'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var bodyParser = require('body-parser');
const r = require('rethinkdb');
const DatabaseController = require('./api/controllers/database_controller.js');
module.exports = app; // for testing

const databaseController = new DatabaseController();

var config = {
  appRoot: __dirname // required config
};

var connection = {
    host: "127.0.0.1",
    port: 28015,
    authKey: "",
    db: "ShopProject"
};

(function(app) {
	r.connect(connection, (err, conn) => {
		if(err) {
			console.log('Could not open a connection to initialize the database: ' + err.message);
		} else {
			console.log('Connected.');
            app.set('rethinkdb.conn', conn);
            databaseController.createDatabase(conn, connection.db)
				.then(() => {
					return databaseController.createTable(conn, 'Shop');
				})
				.then(() => {
                    return databaseController.createTable(conn, 'Product');
                })
				.catch((err) => {
                    console.log('Error creating database and/or table: ' + err);
                })
		}
	});
})(app);

app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(bodyParser.json());

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});
