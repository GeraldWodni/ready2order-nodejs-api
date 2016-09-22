var ready2order = require('../api');
var fs = require('fs');

/* read userToken and convert to string */
var userToken = fs.readFileSync( '../userToken.txt' ) + '';

/* create new wrapper */
var r2o = ready2order( { api_key: userToken } );

/* get company definition */
r2o.get('company', function( err, json ) {
    if( err ) return console.error( err );

    console.log( JSON.stringify( json, null, 4 ) );
});
