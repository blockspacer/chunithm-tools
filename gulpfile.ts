import * as gulp from "gulp";
import * as typescript from "gulp-typescript";

gulp.task("build-server", (done) => {
    const project = typescript.createProject("./tsconfig.json");
    project.src()
           .pipe(project())
           .pipe(gulp.dest("./build"));
    done();
});

gulp.task("build", gulp.parallel([
    gulp.task("build-server")
]));

gulp.task("default", gulp.task("build"));
