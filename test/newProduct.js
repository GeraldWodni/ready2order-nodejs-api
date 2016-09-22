var expect = require("chai").expect;

var ready2order = require('../api');
var fs = require('fs');

describe( "ready2order api v1 new product", function() {

    var userToken, r2o, productgroup_id, product_id;
    it( "read userToken", function() {
        userToken = fs.readFileSync( 'userToken.txt' ) + '';
    });

    it( "create wrapper", function() {
        r2o = ready2order( { api_key: userToken } );
    });

    describe( 'api-call (put)', function() {
        it( 'new productgroup', function(done) {
            r2o.put( 'productgroups', {
                productgroup_name: 'node.js Testproductgroup'
            }, function( err, productgroup ) {
                expect( err ).to.be.null;
                expect( productgroup ).to.have.property('productgroup_id');
                expect( productgroup ).to.have.property('productgroup_name', 'node.js Testproductgroup');
                productgroup_id = productgroup.productgroup_id;
                done(err);
            });
        });

        it( 'new product', function(done) {
            r2o.put( 'products', {
                product_name: 'Cupcake',
                product_price: 5.2,
                product_vat: 20,
                productgroup: {
                    productgroup_id: productgroup_id
                }
            }, function( err, product ) {
                expect( err ).to.be.null;
                expect( product ).to.have.property('product_id');
                expect( product ).to.have.property('product_name', 'Cupcake');
                /* floats and ints are passed as strings by the api */
                //expect( product ).to.have.property('product_price', 5.2);
                //expect( product ).to.have.property('product_vat', 20);
                product_id = product.product_id;
                done(err);
            });
        });
    });


    describe( 'api-cal (delete)', function() {
        it( 'delete new product', function(done) {
            r2o.delete( 'products/' + product_id, function( err, response ) {
                expect( err ).to.be.null;
                expect( response ).to.have.property('success', true);
                done(err);
            });
        });

        it( 'delete new productgroup', function(done) {
            r2o.delete( 'productgroups/' + productgroup_id, function( err, response ) {
                expect( err ).to.be.null;
                expect( response ).to.have.property('success', true);
                done(err);
            });
        });
    });

});
