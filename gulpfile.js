var gulp = require('gulp');
var less = require('gulp-less');
var include = require("gulp-include");
var install = require("gulp-install");
var gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var node; //this stores the node instance

//build and source directories
var dirs = {
    clientbuild: "build/public",
    clientsrc: "src/client",
    serverbuild: "build",
    serversrc: "src/server"
};

//kill node on exit
process.on('exit', function () {
    if (node) node.kill();
});


/* Build server */
gulp.task('copy-server', function () {
    if (!fs.existsSync(dirs.serverbuild)) {
        fs.mkdirSync(dirs.serverbuild, 0744);
    }
    return gulp.src(dirs.serversrc + '/**/*')
        .pipe(gulp.dest(dirs.serverbuild + '/'));
});

gulp.task('install-npm', function() {
    return gulp.src([dirs.serverbuild + '/package.json'])
        .pipe(install());
})

//concatenate all js files into one

gulp.task('js', function () {
    if (!fs.existsSync(dirs.clientbuild)) {
        fs.mkdirSync(dirs.clientbuild, { recursive: true });
    }
    return gulp.src(dirs.clientsrc + '/js/App.js')
        .pipe(include())
        //.pipe(gp_sourcemaps.init())
        .pipe(gp_concat('App.js'))
        .pipe(gulp.dest(dirs.clientbuild + '/js'))
        .pipe(gp_rename('App.min.js'))
        .pipe(gp_uglify())
        //.pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.clientbuild + '/js'));
});

gulp.task('i18next', function () {
    if (!fs.existsSync(dirs.clientbuild)) {
        fs.mkdirSync(dirs.clientbuild, 0744);
    }
    return gulp.src(dirs.clientsrc + '/lib/*')
        .pipe(gulp.dest(dirs.clientbuild + '/js'));
});

gulp.task('less', function () {
    if (!fs.existsSync(dirs.clientbuild)) {
        fs.mkdirSync(dirs.clientbuild, 0744);
    }
    return gulp.src(dirs.clientsrc + '/style/style.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest(dirs.clientbuild + '/style'));
});

//simply copy html and static files
gulp.task('html', function () {
    if (!fs.existsSync(dirs.clientbuild)) {
        fs.mkdirSync(dirs.clientbuild, 0744);
    }
    return gulp.src(dirs.clientsrc + '/*.html')
        .pipe(gulp.dest(dirs.clientbuild + '/'));
});

gulp.task('static', function () {
    if (!fs.existsSync(dirs.clientbuild)) {
        fs.mkdirSync(dirs.clientbuild, 0744);
    }
    return gulp.src(dirs.clientsrc + '/static/*')
        .pipe(gulp.dest(dirs.clientbuild + '/static'));
});

//automagically re-build and run
gulp.task('develop', function () {
    gulp.start('run');
    gulp.watch(dirs.serversrc + '/**/*', ['server', 'run']);
    gulp.watch(dirs.clientsrc + '/**/*', ['client']);
});

gulp.task('client', gulp.series(['js', 'i18next', 'less', 'html', 'static']));
gulp.task('server', gulp.series(['copy-server', 'install-npm']));
gulp.task('build', gulp.series(['client', 'server']));

gulp.task('run', function () {
    if (!fs.existsSync(dirs.serverbuild)) {
        fs.mkdirSync(dirs.serverbuild, 0744);
    }
    process.chdir(dirs.serverbuild);
    if (node) node.kill();
    node = spawn('node', ['index.js'], { stdio: 'inherit' });
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    process.chdir(__dirname);
});

gulp.task('default', gulp.series(['run']));