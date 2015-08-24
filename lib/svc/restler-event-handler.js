/**
 * Created by stevenchin on 8/24/15.
 */

'use strict';

var Q = require('q'),
    Error2 = require('error2');
var eventHandler = {};

eventHandler.resolveRequest = function(restlerObj){
    var d = Q.defer();
    restlerObj.on('success', d.resolve);
    restlerObj.on('fail', function(data, resp) {
        var err;
        var resourceNotFoundError = {
            name: 'ResourceNotfound',
            message: 'Cannot find specified resource, please ensure the url is valid',
            data: data
        };
        var unauthorizedError = {
            name: 'Unauthorized',
            message: 'This request does not have an authentication token, ensure that you are authenticated before making another request',
            data: data
        };
        var requestError = {
            name: 'BadRequest',
            message: 'Bad request, please use the API guide located at https://api.mmitnetwork.com/Home/QuickStart make the appropriate request',
            data: data
        };
        switch(resp.statusCode) {
            case 404:
                err = new Error2(resourceNotFoundError);
                break;
            case 401:
                err = new Error2(unauthorizedError);
                break;
            default:
                err = new Error2(requestError);
                break;
        }
        d.reject(err);
    });
    restlerObj.on('error', function(err, resp) {
        var internalServerErr = {
            name: 'Internal Server Error',
            message: 'Unable to connect to MMIT API',
            data: err
        };
        d.reject(new Error2(internalServerErr));
    });
    return d.promise;
};

module.exports = eventHandler;