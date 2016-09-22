var ready2order = require('../api');
var fs = require('fs');

/* read userToken and convert to string */
var userToken = fs.readFileSync( '../userToken.txt' ) + '';

/* create new wrapper */
var r2o = ready2order( { api_key: userToken } );

/* new productgroup */
r2o.put( 'productgroups', {
    productgroup_name: 'node.js Testproductgroup'
}, function( err, productgroup ) {
    if( err ) return console.error( err );

    /* new product */
    r2o.put( 'products', {
        product_name: 'Cupcake',
        product_price: 5.2,
        product_vat: 20,
        productgroup: {
            productgroup_id: productgroup.productgroup_id
        }
    }, function( err, product ) {
        if( err )
            console.error( err );
        else
            console.log( 'Success: Productgroup and Product created' );
    });
});
