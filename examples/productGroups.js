var ready2order = require('../api');
var fs = require('fs');

/* read userToken and convert to string */
var userToken = fs.readFileSync( '../userToken.txt' ) + '';

/* create new wrapper */
var r2o = ready2order( { api_key: userToken } );

/* show all groups */
function showGroups( text, callback ) {
    r2o.get('productgroups', function( err, groups ) {
        if( err ) return console.error( err );

        console.log( "=== " + text + " ===" );
        console.log( JSON.stringify( groups, null, 4 ) );

        callback();
    });
}

/* create new productgroup */
r2o.put( 'productgroups', {
    productgroup_name: "Demotest",
    productgroup_description: "Demobeschreibung",
    productgroup_shortcut: "I",
    productgroup_active: 1,
    productgroup_parent: null,
    productgroup_sortIndex: 0
}, function( err, newGroup ) {
    if( err ) return console.error( "Unable to create new group", err );

    /* update shortcut */
    r2o.post( 'productgroups/' + newGroup.productgroup_id, {
        productgroup_shortcut: 'S'
    }, function( err ) {
        if( err ) return console.error( "Unable to update new group", err );

        /* print current groups */
        showGroups( "All groups (including new)", function() {

            /* delete new group */
            r2o.delete( 'productgroups/' + newGroup.productgroup_id, function( err, data ) {
                if( err ) return console.error( "Unable to delete new group", err );
                console.log( "Delete:", data );

                /* print current groups */
                showGroups( "All groups (new has been deleted)", function() {
                    console.log( "All Done" );
                });
            });
        });
    });
});
