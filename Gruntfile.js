module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
					'views/layouts/*.hbs'
                ],

                options: {
                      // See wiredep's configuration documentation for the options
                      // you may pass:

                      // https://github.com/taptapship/wiredep#configuration
                      exclude: ['plugins/jquery/', 'plugins/modernizr/'],
                      ignorePath: '../../public'
                }
            }
        },
		copy: {
			main: {
				files: [
					{
						nonnull: true,
						expand: true,
						cwd: 'public/www/',
						src: ['**'],
						dest: 'public/'
					}
				]
			}
		},
		exec: {
			run: 'node bin/www'
		},
		simplemocha: {
			all: {
				src: ["test/**/*.js"]
			},
			ui: {
				src: ["test/ui/*.js"]
			},
			models: {
				src: ["test/models/*.js"]
			}
		},
		open : {
		    dev : {
		      path: 'http://localhost:3000/',
		      app: 'Firefox'
		    }
		}
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-harp');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-open');

    // Default task(s).
    grunt.registerTask('default', ['compile']);

	grunt.registerTask('test', ['simplemocha:all']);
	grunt.registerTask('run', ['exec:run']);
    grunt.registerTask('heroku', ['exec:run']);

};
