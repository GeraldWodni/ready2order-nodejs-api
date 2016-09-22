var ready2order = require('../api');
var fs = require('fs');

/* read userToken and convert to string */
var userToken = fs.readFileSync( '../userToken.txt' ) + '';

/* create new wrapper */
var r2o = ready2order( { api_key: userToken } );

/* show all groups */
r2o.get('productgroups', function( err, groups ) {
    if( err ) return console.error( err );

    console.log( JSON.stringify( groups, null, 4 ) );
});
