'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk'); // https://github.com/sindresorhus/chalk


var NyplGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous NYPL web application generator!'));
    this.log(chalk.yellow('Comes packed with JQuery, SASS, Modernizr and more...'));

    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name?'
    },
    {
      type: 'confirm',
      name: 'includeBase',
      message: chalk.cyan('Would you like to add NYPL Base?'),
      default: true
    },
    {
      type: 'confirm',
      name: 'includeMenu',
      message: chalk.red('Would you like to include the Main Navigation?')
    },
    {
      type: 'list',
      name: 'appType',
      message: chalk.green('What type of web application will this be?'),
      choices: [{
        name: 'HTML5 Standard Web App',
        value: 'includeStandard',
        checked: false
      },{
        name: 'Angular Web App',
        value: 'includeAngular',
        checked: false
      }]

    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: false
      },{
        name: 'JQuery',
        value: 'includeJquery',
        checked: false
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {
      var applicationType = props.appType;
      var features = props.features;

      function hasType(appType) {
        return applicationType.indexOf(appType) !== -1;
      }

      function hasFeat(feature) {
        return features.indexOf(feature) !== -1;
      }

      this.appName          = props.appName;
      this.includeBase      = props.includeBase;
      this.includeMenu      = props.includeMenu;
      this.includeStandard  = hasType('includeStandard');
      this.includeAngular   = hasType('includeAngular');
      this.includeSass      = hasFeat('includeSass');
      this.includeJquery    = hasFeat('includeJquery');
      this.includeModernizr = hasFeat('includeModernizr');

      done();
    }.bind(this));
  },

  packageJsonInclude: function () {
    this.copy('_package.json', 'package.json');
  },

  bowerJsonInclude: function () {
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
  },

  gruntFileInclude: function () {
    this.copy("_gruntfile.js", "Gruntfile.js");
  },

  jsHintInclude: function () {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  gitIgnore: function () {
    this.template('_gitignore', '.gitignore');
  },

  angularSkeleton: function () {
    if (this.includeAngular) {
      this.mkdir('public/scripts');
      this.mkdir('public/scripts/controllers');
      this.mkdir('public/scripts/filters');
      this.mkdir('public/scripts/services');
      this.mkdir('public/scripts/directives');
      this.mkdir('public/views');
      this.mkdir('public/views/directives');
    }
  },

  standardSkeleton: function () {
    if (this.includeStandard) {
      this.mkdir('public/scripts');
    }

  },

  app: function () {
    this.mkdir('public');
    this.mkdir('public/partials');
    this.mkdir('public/css');
  },
  
  projectFiles: function () {
    this.copy('_header.html', 'public/partials/header.html');
    this.copy('_content.html', 'public/partials/content.html');
    this.copy('_footer.html', 'public/partials/footer.html');
    this.copy("_styles.css", "public/css/styles.css");
  },

  sassInclude: function () {
    if (this.includeSass) {
      this.mkdir('public/scss');
      this.copy("_styles.scss", "public/scss/styles.scss");
    }
  }

});

module.exports = NyplGenerator;
