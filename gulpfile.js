const async = require('async');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const rename = require('gulp-rename');
const consolidate = require('gulp-consolidate');

let fontName = 'goku-icon',
    className = 'g-icon';

gulp.task('Iconfont', function(done) {
    const iconStream = gulp.src(['assets/icons/*.svg'])
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: true,
            normalize: true,
            fontHeight: 1001,
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
        }));

    async.parallel([
        function handleCSS(cb) {
            iconStream.on('glyphs', function(glyphs, options) {
                gulp.src('templates/myfont.css')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: fontName,
                        fontPath: '../fonts/',
                        className: className
                    }))
                    .pipe(rename(`${fontName}.css`))
                    .pipe(gulp.dest('dist/css/'))
                    .on('finish', cb);
            });
        },
        function handleExample(cb) {
            iconStream.on('glyphs', (glyphs, options) => {
                gulp.src('templates/myfont.html')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: fontName,
                        className: className
                    }))
                    .pipe(rename(`${fontName}.html`))
                    .pipe(gulp.dest('dist/'))
                    .on('finish', cb);
            })
        },
        function handleFonts(cb) {
            iconStream
                .pipe(gulp.dest('dist/fonts/'))
                .on('finish', cb);
        }
    ], done);
});