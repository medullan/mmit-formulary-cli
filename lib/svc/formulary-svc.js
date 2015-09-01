/**
 * Created by stevenchin on 8/20/15.
 */

'use strict';

var rest = require('restler'),
    _ = require('lodash'),
    Q = require('q'),
    mmitAPI = require('./../config/mmit-config').api,
    eventHandler = require('./restler-event-handler');

var svc = {};

svc.requestToken = function(username, password){
    var d = Q.defer();
    var tokenUrl = mmitAPI.baseUrl + mmitAPI.auth;
    var tokenReqOpts = {
        header: {
            //ensure that changes to the post method in restler does not affect request
            'Content-Type':'application/x-www-form-urlencoded'
        },
        data: {
            'grant_type': 'password',
            username: username,
            password: password
        }
    };
    console.log('Sit tight while we request your token ...');
    var reslerObj = rest.post(tokenUrl, tokenReqOpts);
    eventHandler.resolveRequest(reslerObj).then(function(response){
        svc.authToken = response['access_token'];
        console.log('Your token was retrieved!');
        d.resolve(response);
    }, d.reject);
    return d.promise;
};

svc.getProductByName = function(productName){
    var d = Q.defer();
    var productUrl = mmitAPI.baseUrl + mmitAPI.product;
    var productReqOpts = {
        headers: {
            Authorization: 'Bearer ' + svc.authToken
        },
        query:{
            Name: productName
        }
    };
    console.log('Requesting the product %s ...', productName);
    var reslerObj = rest.get(productUrl, productReqOpts);
    eventHandler.resolveRequest(reslerObj).then(function(response){
        console.log('Request for the product %s was successful!', productName);
        d.resolve(response.Products);
    }, d.reject);
    return d.promise;
};

svc.getCoverage = function(productId, planId){
    var d = Q.defer();
    var coverageUrl = mmitAPI.baseUrl + mmitAPI.coverage;
    var coverageReqOpts = {
        headers: {
            Authorization: 'Bearer ' + svc.authToken
        },
        query:{
            ProductId: productId,
            PlanId: planId
        }
    };
    console.log('Requesting plan coverage for the productId: %s and the planId: %s ...', productId, planId);
    var reslerObj = rest.get(coverageUrl, coverageReqOpts);
    eventHandler.resolveRequest(reslerObj).then(function(response){
        console.log('Plan coverage request for the productId: %s and the planId: %s was successful!', productId, planId);
        d.resolve(response.PlanCoverages);
    }, d.reject);
    return d.promise;
};

svc.getFormularyTiers = function(){
    var d = Q.defer();
    var formularyUrl = mmitAPI.baseUrl + mmitAPI.formularyTiers;
    var formularyReqOpts = {
        headers: {
            Authorization: 'Bearer ' + svc.authToken
        }
    };
    console.log('Requesting formulary tiers ...');
    var reslerObj = rest.get(formularyUrl, formularyReqOpts);
    eventHandler.resolveRequest(reslerObj).then(function(response) {
        console.log('Request for formulary tiers was successful!');
        d.resolve(response);
    }, d.reject);
    return d.promise;
};

svc.getFormularyTier = function(tierId){
    var d = Q.defer();
    console.log('Requesting formulary tier: %s ...', tierId);
    svc.getFormularyTiers().then(function(tiers){
        var tier = _.find(tiers.FormularyTiers, {FormularyTierId: tierId}, null);
        console.log('Request for formulary tier %s was successful!', tierId);
        d.resolve(tier);
    }, d.reject);
    return d.promise;
};

module.exports = svc;