module.exports = function(grunt) {

  // Load the plugins.
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-open');


  // Project configuration.
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          base: './'
        }
      }
    },
    typescript: {
        base: {
          src: ['dev/ts/**/*.ts'],
          dest: 'js/',
          options: {
              module: 'amd',
              base_path:'dev/ts/',
              target: 'es5',
              comments : false,
              ignoreTypeCheck : false
          }
        }
    },
    watch: {
      options: {
        livereload: true
      },
      js:{
        files: 'dev/ts/**/*.ts',
        tasks: ['typescript']
      },
      css:{
        files: 'dev/styl/**/*.styl',
        tasks: ['stylus'],
      },
      html:{
        files: '*.html'
      }
    },
    open: {
      dev: {
        path: 'http://localhost:8080/index.html'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/*.js',
        dest: 'build/*.js'
      }
    },
    stylus: {
      compile: {
        options: {
          compress: true
        },
        files: {
        'css/style.css': 'dev/styl/*.styl',
        }
      }
    }
  });

  grunt.registerTask('default', ['connect', 'open', 'watch']);
};