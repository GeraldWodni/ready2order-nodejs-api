ready2order node.js API
=============

Wrapper for simply using ready2order API api.ready2order.at
_Hint: I am not associated with ready2order, see bottom notice_

[Website](www.ready2order.at)

[Documentation](http://docs.ready2order.apiary.io/)

Please contact developer@ready2order.at to get your secret master token!

Installation
------------

You can install ready2order-api with npm

```
npm get ready2order-api
```

Examples
--------

Get client data

```javascript
var ready2order = require('ready2order-api');

var r2o = ready2order('user-token');
r2o.get('company', function( err, json ) {
    if( err ) return console.error( err );

    console.log( JSON.stringify( json, null, 4 ) );
});
```

Insert new productgroup with one product

```javascript
var ready2order = require('ready2order-api');

var r2o = ready2order('user-token');

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
```

This library is based on [duxthefux/ready2order-php-api-v1](https://github.com/duxthefux/ready2order-php-api-v1)
--------
I ported this library to node.js, because my client requested the integration of their system, and there was no prior node.js-api available.
I am in no way related to ready2order, please contact the company for any questions (bug reports related to this implementation are of course excluded).
