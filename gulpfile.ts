import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as WebpackStream from "webpack-stream";
import config from "./webpack.config";

gulp.task("build-server", () => {
    const project = typescript.createProject("./tsconfig.json");
    return project.src()
           .pipe(project())
           .pipe(gulp.dest("./build"));
});

gulp.task("build-client", () => {
    return gulp.src("./src/client/index.ts")
            .pipe(WebpackStream(config))
            .pipe(gulp.dest("./build/client"));
});

gulp.task("build", gulp.parallel([
    gulp.task("build-server"),
    gulp.task("build-client")
]));

gulp.task("default", gulp.task("build"));
