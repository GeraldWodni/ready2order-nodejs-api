var expect = require("chai").expect;

var ready2order = require('../api');
var fs = require('fs');

describe( "ready2order api v1 retries", function() {

    var userToken, r2o, productgroup_id, product_id, errorLog = [];
    it( "read userToken", function() {
        userToken = fs.readFileSync( 'userToken.txt' ) + '';
    });

    it( "create wrapper", function() {
        r2o = ready2order( { api_key: userToken, retries: 3, retryTimeout: 100,
            retryErrorLog: function( err ){
                errorLog.push( err );
            }
        });
    });

    describe( 'api-call (put)', function() {
        it( 'broken 3-retries', function(done) {
            r2o.put( 'productgroups', {
            }, function( err, productgroup ) {
                expect( err ).to.be.not.null;
                expect( err ).to.have.property('message', '406 Not Acceptable');
                expect( errorLog ).to.have.property( 'length', 3 );
                done();
            });
        });
        it( 'update, broken 1-retry', function(done) {
            r2o.updateOpts( {retries: 1} );
            r2o.put( 'productgroups', {
            }, function( err, productgroup ) {
                expect( err ).to.be.not.null;
                expect( err ).to.have.property('message', '406 Not Acceptable');
                expect( errorLog ).to.have.property( 'length', 4 );
                done();
            });
        });
        it( 'update, broken 0-retries', function(done) {
            r2o.updateOpts( {retries: 0} );
            r2o.put( 'productgroups', {
            }, function( err, productgroup ) {
                expect( err ).to.be.not.null;
                expect( err ).to.have.property('message', '406 Not Acceptable');
                expect( errorLog ).to.have.property( 'length', 4 );
                done();
            });
        });
    });

});
