module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'public/**/*.html',   // .html support...
					'public/**/*.jade',
                    'app/config.yml'         // and .yml & .yaml support out of the box!
                ],

                options: {
                      // See wiredep's configuration documentation for the options
                      // you may pass:

                      // https://github.com/taptapship/wiredep#configuration
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
		}
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-harp');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-simple-mocha');

    // Default task(s).
    grunt.registerTask('default', ['compile']);

	grunt.registerTask('test', ['simplemocha:all'])
	grunt.registerTask('run', ['exec:run'])

};
