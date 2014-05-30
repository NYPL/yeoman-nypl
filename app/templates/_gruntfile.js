module.exports = function(grunt) {

	// Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    //task config
		concat: {
	    dist: {
        src: ["public/partials/header.html", "public/partials/content.html", "public/partials/footer.html"],
        dest: "public/index.html"
	    }
		},
		cssmin: {
	    css: {
        files: {
            "public/css/styles.min.css": ["public/css/*.css"]
        }
	    }
		},
   // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: 'public/index.html',
        ignorePath: 'public/'
      }
    },
		connect: {
			all: {
		    options: {
		    	port: 3000,
	        keepalive: true,
	        open: true,
	        hostname: 'localhost',
	        middleware: function(){
	          //custom handlers here
						var middleware = [];
						 
						middleware.push(function(req, res, next) {
					    if (req.url !== "/") return next();
					     
					    res.setHeader("Content-type", "text/html");
					    var html = grunt.file.read("public/partials/header.html");
					    html 		+= grunt.file.read("public/partials/content.html");
					    html 		+= grunt.file.read("public/partials/footer.html");
					    res.end(html);
						});

						middleware.push(function(req, res, next){
					    if (req.url !== "/css/styles.css") return next();
					     
					    res.setHeader("Content-type", "text/css");
					    var css = "";
					 
					    var files = grunt.file.expand("public/css/*.css");
					    for (var i = 0; i < files.length; i++) {
					      css += grunt.file.read(files[i]);
					    }
					 
					    res.end(css);
						});

						middleware.push(function(req, res){
					    res.statusCode = 404;
					    res.end("404 Not Found");
						});
						 
						return middleware;
	        }
	      }
	    }
		}

  });
 
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
 
  grunt.registerTask('serve', ['concat', 'bower-install', 'connect:all']);
  grunt.registerTask('build', ['concat', 'cssmin', 'connect:all']);
  grunt.registerTask('default', ['serve']);
};