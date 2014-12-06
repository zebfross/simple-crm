module.exports = function (grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            
            task: {
                
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'public/_source/**/*.html',   // .html support...
					'public/_source/**/*.ejs',
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
			dist: 'harp compile public\\_source --output ..\\www',
			server: 'harp server public'
		}
    });
    
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-harp');
	grunt.loadNpmTasks('grunt-exec');
    
    // Default task(s).
    grunt.registerTask('default', ['wiredep']);
	
	grunt.registerTask('harp', ['exec:dist', 'copy:main', 'exec:server']);
	grunt.registerTask('compile', ['exec:dist', 'copy:main']);

};