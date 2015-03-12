'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var _ = require('lodash');

var vAppName = path.basename(__dirname);
var scheduleRouter = express.Router();
var results = {};

// TODO: placeholder
function getVersion4User(userId) {
    var map = {
        '1016': 'v1.0',
        '1017': 'v1.1',
        '1018': 'v1.0'
    };

    return map[userId] ? map[userId] : 'v1.0';
}

scheduleRouter.all('/:userId(\\d+)/', function(req, res, next) {
    var userId = req.params.userId;
    var version = getVersion4User(userId);

    req.url = path.join('/', vAppName, version, req.url);

    next();
});

results['/'] =  scheduleRouter;

var versions = fs.readdirSync(__dirname).filter(function(file) {
    return fs.statSync(path.join(__dirname, file)).isDirectory();
});

_.forEach(versions, function(version) {
    var mountpath =  path.join('/', vAppName, version);
    var instance = require(path.join(__dirname, version, 'index'));
    results[mountpath] = instance;
});

module.exports = results;
