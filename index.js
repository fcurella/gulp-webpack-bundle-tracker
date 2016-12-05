'use strict';

var _ = require('lodash');
var gutil = require('gulp-util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var slash = require('slash');
var jsonFile = require('jsonfile')
var through = require('through');

function bundlemanifest(options) {
    options = _.defaults(options || {}, {
        dest: process.cwd(),
        filename: 'webpack-stats.json'
    });

    var outputFilePath = path.resolve(options.dest, options.filename);
    var hashes = {
        "chunks": {}
    };
    var pluginName = 'gulp-webpack-bundle-tracker';

    function computePaths(file) {
        if (file.named === undefined) {
            this.emit('error', new gutil.PluginError(pluginName, 'Stream must be named. See https://github.com/shama/vinyl-named'));
        }
        if (file.isNull()) {
            return;
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(pluginName, 'Streams not supported'));
            return;
        }

        var filePath = path.resolve(options.dest, file.path);
        var relativeFilePath = slash(path.relative(path.dirname(outputFilePath), filePath));
        if (hashes.chunks[file.named] === undefined) { hashes.chunks[file.named] = [] };
        hashes.chunks[file.named].push({
            "name": path.basename(file.path),
            "path": file.path
        });

        this.push(file);
    }

    function writePaths() {
        var self = this;

        if (!fs.existsSync(outputFilePath)) {
            mkdirp(path.dirname(outputFilePath));
        }

        jsonFile.writeFile(outputFilePath, hashes, function (err) {
            if (err) {
                self.emit('error', new gutil.PluginError(pluginName, err));
            }
        });

        this.emit('end');
    }

    return through(computePaths, writePaths);
}

module.exports = bundlemanifest;