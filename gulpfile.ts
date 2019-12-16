import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as WebpackStream from "webpack-stream";
import bookmarkletConfig from "./bookmarklet.webpack.config";
import config from "./webpack.config";

gulp.task("build-server", () => {
    const project = typescript.createProject("./tsconfig.json");
    return project.src()
           .pipe(project())
           .pipe(gulp.dest("./build"));
});

gulp.task("build-client", () => {
    process.env.HOST = process.env.NODE_ENV === "production"
                                    ? "chunithmtools.net"
                                    : "ctenv.raclett3.com";
    return gulp.src("./src/client/index.ts")
            .pipe(WebpackStream(config))
            .pipe(gulp.dest("./build/client"));
});

gulp.task("build-bookmarklet", () => {
    process.env.HOST = process.env.NODE_ENV === "production"
                                    ? "chunithmtools.net"
                                    : "ctenv.raclett3.com";
    return gulp.src("./src/bookmarklet/index.ts")
            .pipe(WebpackStream(bookmarkletConfig))
            .pipe(gulp.dest("./build/bookmarklet"));
});

gulp.task("build", gulp.series([
    gulp.task("build-server"),
    gulp.task("build-client"),
    gulp.task("build-bookmarklet")
]));

gulp.task("default", gulp.task("build"));
