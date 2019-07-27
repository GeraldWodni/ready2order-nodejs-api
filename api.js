/**
 * Node.js library for ready2order POS API v1
 * @author Gerald Wodni <gerald.wodni@gmail.com>
 *
 * Based on:
 * PHP library for ready2order POS API v1
 * @author Christopher Fuchs <developer@ready2order.at>
 */

var _       = require( 'underscore' );
var https   = require( 'https' );
var url     = require( 'url' );
var fs      = require("fs");

/* TODO: create test from 2nd example, upload as NPM package */
module.exports = function( opts ) {
    if( !_.has( opts, 'api_key' ) )
        throw new Error( 'ready2order: No api_key supplied' );

    /* supply default options */
    _.defaults( opts, {
        api_endpoint: 'https://api.ready2order.at/v1',
        retries: 0,
        retryTimeout: 3000,
        retryErrorLog: function( err ) {}
    });

    /* ensure trailing slash on api_endpoint */
    opts.api_endpoint += opts.api_endpoint.lastIndexOf( '/' ) == opts.api_endpoint.length - 1 ? '' : '/';

    /* parse endpoint once */
    opts.api_endpoint_url_object = _.pick( url.parse( opts.api_endpoint ), ['protocol', 'host', 'hostname', 'path', 'port']);

    /* common requester */
    function makeBasicRequest( httpMethod, args, cb ) {
        if( args.length == 0 )
            throw new Error( 'ready2order: No method given' );
        
        /* madatory argument */
        var method      = args[0];
        /* use args if they are not the callback */
        var methodArgs  = _.isObject( args[1] ) & !_.isFunction( args[1] ) ? args[1] : {};
        /* use reqOpts if they are not the callback */
        var reqOpts     = _.isObject( args[2] ) & !_.isFunction( args[2] ) ? args[2] : {};
        /* find callback (can be supplied as any arguemnt from 1-3 */
        var callback    = function( err, res ) {
            /* report error */
            if( err )
                return cb( err );

            /* check status */
            if( res.statusCode < 200 || res.statusCode > 299 )
                err = new Error( res.statusCode + ' ' + res.statusMessage );

            var data = '';
            res.on( 'data', function( chunk ) {
                data += chunk;
            });
            res.on( 'end', function() {
                if( data != '' )
                    try {
                        data = JSON.parse( data );
                    } catch( ex ) {
                        err = ex;
                        data = data;
                    }

                if( _.isFunction( cb ) )
                    cb( err, data )
            });

        };

        /* assemble http-request-options and allow overruling by reqOpts */
        var httpOpts = _.extend( {}, opts.api_endpoint_url_object, {
            path: opts.api_endpoint_url_object.path + method,
            method: httpMethod,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'test-user-agent',
                'Authorization': opts.api_key
            }
        }, reqOpts );

        /* log */
        function log( err ) {
            if( opts.logFile )
                fs.appendFile( opts.logFile, JSON.stringify( {
                    time: new Date(),
                    method: method,
                    args: methodArgs,
                    httpMethod: httpMethod,
                    success: err == null,
                    err: err || null
                }, null, 4 ),
                function _logFileCallback( err ) {
                    if( err )
                        console.log( "r2o-logFile-Error:", err )
                });
        }

        /* perform request and hook callback */
        var req = https.request( httpOpts, function( res ) {
            log( null );
            callback( null, res );
        });

        /* handle errors */
        req.on( 'error', function( err ) {
            log( err );
            callback( err );
        });

        /* install timeout */
        req.on( 'socket', function( socket ) {
            socket.setTimeout( reqOpts.timeout || opts.timeout || 10000 );
            socket.on( 'timeout', function() {
                req.abort();
            });
        });

        /* send body */
        if( !_.isEmpty( methodArgs ) )
            req.write( JSON.stringify( methodArgs ) );
        req.end();
    }

    function makeRequest( method, args ) {
        var remainingRetries= opts.retries;
        var callback = _.isFunction( args[1] ) ? args[1] : _.isFunction( args[2] ) ? args[2] : args[3];

        /* replace callback */
        function retryWrapper( err, data ) {
            /* retry: report error and hold back for retryTimeout */
            if( remainingRetries-- > 0 && err ) {
                opts.retryErrorLog( err );
                setTimeout( function() {
                    makeBasicRequest( method, args, retryWrapper );
                }, opts.retryTimeout );
            }
            else
                callback( err, data );
        }

        /* first request */
        makeBasicRequest( method, args, retryWrapper );
    }

    
    /* expose api */
    return {
        delete: function( method, args, reqOpts, callback ) {
            makeRequest( 'DELETE',  arguments );
        },
        get:    function( method, args, reqOpts, callback ) {
            makeRequest( 'GET',     arguments );
        },
        patch:  function( method, args, reqOpts, callback ) {
            makeRequest( 'PATCH',   arguments );
        },
        post:   function( method, args, reqOpts, callback ) {
            makeRequest( 'POST',    arguments );
        },
        put:    function( method, args, reqOpts, callback ) {
            makeRequest( 'PUT',     arguments );
        },
        updateOpts: function( newOpts ) {
            opts = _.extend( opts, newOpts );
        }
    };
}
    //public function put($method, $args=array(), $timeout=10)
    /**
     * Performs the underlying HTTP request. Not very exciting
     * @param  string $$http_verb   The HTTP verb to use: get, post, put, patch, delete
     * @param  string $method       The API method to be called
     * @param  array  $args         Assoc array of parameters to be passed
     * @return array                Assoc array of decoded result
     */
    //private function makeRequest($http_verb, $method, $args=array(), $timeout=10)
    //{
    //    if(!is_null($json = json_decode($result, true))){
//  //          if(!isset($json["error"]) || $json["error"]==false) return $json;
    //        if(isset($json["error"]) && $json["error"]===true) {
    //            $msg = isset($json["msg"]) && !empty($json["msg"]) ? $json["msg"] : $result;
    //            throw new ready2orderErrorException($msg);
    //        }
    //        return $json;
//  //          if(!$json["error"] && isset($json["msg"])) throw new ready2orderException($json["msg"]);
//  //          else throw new ready2orderException("API Request was bad: ".$result);
    //    } else {
    //        throw new ready2orderException("API Request ({$http_verb} {$url}) gave invalid json: ".$result);
    //    }
    //}
//}
