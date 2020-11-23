var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var fancy_log = require('fancy-log');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var paths = {
  pages: ["src/*.html"],
  images: ["src/img/*"],
  placeholders: ["src/img/placeholder/*"],
  videos: ["src/video/*"],
  fonts: ["src/fonts/*"],
  styles: ["src/styles/main.scss"],
  bundle: ["dist/bundle.js"]
};


var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {},
  })
    .plugin(tsify)
);

function bundle() {
  return watchedBrowserify
    .transform("babelify", {
      presets: ["es2015"],
      extensions: [".ts"],
    })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
}

function css() {
  return gulp.src(paths.styles).pipe(sass()).pipe(gulp.dest('dist'));
}

function html() {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
}

function img() {
  return gulp.src(paths.images).pipe(gulp.dest("dist/img"));
}

function placeholderImg() {
  return gulp.src(paths.placeholders).pipe(gulp.dest("dist/img/placeholder"));
}

function fonts() {
  return gulp.src(paths.fonts).pipe(gulp.dest("dist/fonts"));
}

function videos() {
  return gulp.src(paths.videos).pipe(gulp.dest("dist/video"));
}

function minifyJS() {
  return gulp.src(paths.bundle).pipe(uglify()).pipe(gulp.dest("dist/bundle.min.js"));
}

gulp.task(
  "default",
  gulp.series(bundle, minifyJS, html, css, img, placeholderImg, fonts, videos)
);

gulp.watch('src/styles/*.scss', css);
gulp.watch([ 'src/img/*.jpg', 'src/img/*.svg'], img);
gulp.watch([ 'src/img/placeholder/*.jpg'], placeholderImg);
gulp.watch([ 'src/video/*.mov', 'src/video/*.mp4'], videos);
gulp.watch('src/fonts/*.ttf', fonts);
gulp.watch('src/index.html', html);
gulp.watch('dist/bundle.js', minifyJS);

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', fancy_log);