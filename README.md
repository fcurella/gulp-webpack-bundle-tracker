# gulp-webpack-bundle-tracker

A Gulp plugin for generating a JSON file similar to [webpack-bundle-tracker](https://github.com/owais/webpack-bundle-tracker).

Inspired by [gulp-json-hash-manifest](https://github.com/toppr/gulp-json-hash-manifest).

## Installation

    npm install gulp-webpack-bundle-tracker --save-dev

## Usage

```
var named = require('vinyl-named');
var path = require('path');
var bundles = require('gulp-webpack-bundle-tracker');

gulp.task('compile', function(callback) {
    return gulp.src('js/*.js')
        // other plugins here...
        .pipe(named(function(file) {
            // use the first portion of the filename as the bundle name
            return path.basename(file.path).split('.')[0]
        }))
        .pipe(bundles())
});
```

### Options

- **`dest`** - *string*  
    The destination directory of the hash manifest file.  
    Default: `process.cwd()` (the current working directory)

- **`filename`** - *string*  
    The filename of the stats manifest file.  
    Default: `webpack-stats.json`
