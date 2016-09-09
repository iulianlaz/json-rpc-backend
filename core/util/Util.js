/**
 * -------------------------------
 * Node - hg.Core
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class stores useful information such as: HTTP method names, content types
 */


/**
 * The constructor.
 */
module.exports = Util = function() {};

/**
 * HTTP method names
 */
Util.Method = {
    'GET': 'GET',
    'POST': 'POST',
    'PUT': 'PUT',
    'DELETE': 'DELETE',
    'HEAD': 'HEAD',
    'OPTIONS': 'OPTIONS'
}

/**
 * Content types
 */
Util.CNT_TYPE_JSON = 'application/json';

/**
 * Available HTTP statuses
 * @var integer
 */
Util.StatusCode = {
    'OK': 200,
    'CREATED': 201,
    'ACCEPTED': 202,
    'NO_CONTENT': 204,
    'FOUND': 302,
    'OTHER': 303,
    'NOT_MODIFIED': 304,
    'UNAUTHORIZED': 401,
    'BAD_REQUEST': 400,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'NOT_ALLOWED': 405,
    'LIMIT_EXCEEDED': 409,
    'REQUEST_TOO_LARGE': 413,
    'INTERNAL_SERVER_ERROR': 500,
    'NOT_IMPLEMENTED': 501,
    'SERVICE_UNAVAILABLE': 503
};

Util.getCurrentTime = function() {
    return new Date().getTime();
}

Util.getTime = function(date) {
    return new Date(date).getTime();
}

Util.cloneObject = function(obj) {
    var clonedObj = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            clonedObj[prop] = obj[prop];
        }
    }
    return clonedObj;
}