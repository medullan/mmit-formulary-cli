/**
 * Created by stevenchin on 8/31/15.
 */

'use strict';

var util = {};

util.stringifyJson = function(json, separator){
    return JSON.stringify(json, null, separator);
};

module.exports = util;
