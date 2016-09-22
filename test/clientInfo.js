var expect = require("chai").expect;

var ready2order = require('../api');
var fs = require('fs');

describe( "ready2order api v1 client info", function() {

    var userToken, r2o;
    it( "read userToken", function() {
        userToken = fs.readFileSync( 'userToken.txt' ) + '';
    });

    it( "create wrapper", function() {
        r2o = ready2order( { api_key: userToken } );
    });

    describe( "api-call (get)", function() {
        it( "get client info", function(done) {

            r2o.get('company', function( err, json ) {
                expect( err ).to.be.null;
                expect( json ).to.have.property( 'company_name' );
                done(err);
            });
        });
    });

});
