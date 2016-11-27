'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _quiz = require('./quiz');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
-----------------------------------------------------------------------------------
|
| CLI setup
|
-----------------------------------------------------------------------------------
*/

/*
-----------------------------------------------------------------------------------
|
| Imports
|
-----------------------------------------------------------------------------------
*/

class CLI {
  constructor() {
    this.commands = {
      quiz: [{
        short: '-d',
        long: '--deck',
        description: 'deck to use for quiz',
        isRequired: true
      }, {
        short: '-n',
        long: '--number',
        description: 'number of questions in quiz',
        isRequired: false
      }],
      add: [{
        short: '-d',
        long: '--deck',
        description: 'deck to add question to',
        isRequired: true
      }, {
        short: '-q',
        long: '--question',
        description: 'question to add',
        isRequired: true
      }, {
        short: '-a',
        long: '--answer',
        description: 'answer to add',
        isRequired: true
      }],
      options: [{
        short: '-p',
        long: '--path',
        description: 'path to the directory for question decks',
        isRequired: false
      }]
    };
    this.input = {};
    this.version = '1.0';
  }

  getInput(args) {
    // Parse the command line arguments
    const argv = (0, _minimist2.default)(args);
    this.input.commands = argv._;
    this.input.flags = (0, _lodash.omit)(argv, ['_']);

    // Validate the input
    if (this.flagWasPassed('h') || this.flagWasPassed('help')) return this.displayHelp();
    if (this.flagWasPassed('v') || this.flagWasPassed('version')) return this.displayVersion();
    if (this.hasNoCommand()) return this.displayHelp();
    if (this.hasMoreThanOneCommand()) return this.displayHelp();
    if (this.hasIllegalCommands()) return this.displayHelp();
    if (this.hasIllegalFlags()) return this.displayHelp();
  }

  hasNoCommand() {
    if (this.input.commands.length === 0) return true;else return false;
  }

  hasIllegalCommands() {
    for (const command of this.input.commands) {
      if (Object.keys(this.commands).indexOf(command) === -1) return true;
    }
    return false;
  }

  hasIllegalFlags() {
    const command = this.input.commands[0];
    const allowedFlags = [];
    for (const flagGroup of this.commands[command]) {
      allowedFlags.push(flagGroup.short.replace(/-/g, ''));
      allowedFlags.push(flagGroup.long.replace(/-/g, ''));
    }
    for (const flag of Object.keys(this.input.flags)) {
      if (allowedFlags.indexOf(flag) === -1) return true;
    }
    return false;
  }

  hasMoreThanOneCommand() {
    return this.input.commands.length > 1;
  }

  flagWasPassed(flag) {
    flag = flag.replace(/-/g, '');
    for (const inputFlag of Object.keys(this.input.flags)) {
      if (inputFlag === flag) return true;
    }
    return false;
  }

  runCommand() {
    const command = this.input.commands[0];
    if (command === 'quiz') {
      const deckName = this.input.flags.d || this.input.flags.deck;
      const numQuestions = this.input.flags.n || this.input.flags.number;
      return (0, _quiz.runQuiz)(deckName, numQuestions);
    } else if (command === 'add') {
      const deckName = this.input.flags.d || this.input.flags.deck;
      const question = this.input.flags.q || this.input.flags.question;
      const answer = this.input.flags.a || this.input.flags.answer;
      return (0, _quiz.runAdd)(deckName, question, answer);
    } else if (command === 'options') {
      const path = this.input.flags.p || this.input.flags.path;
      return (0, _quiz.runOptions)(path);
    }
  }

  displayHelp() {
    console.log('');

    console.log(_chalk2.default.yellow.underline('Commands'));
    console.log(_chalk2.default.dim('* Term-flash documentation: https://github.com/lindekaer/term-flash'));
    console.log(_chalk2.default.dim('* Pass "--help" or "-h" to see this message again'));

    console.log('');

    this.displayCommands();

    console.log('');

    console.log(_chalk2.default.yellow.underline('Examples'));
    console.log(_chalk2.default.dim('> term-flash quiz -d history -n 20'));
    console.log(_chalk2.default.dim('> term-flash add -d history -q "When was the French revolution?" -a "1789"'));

    console.log('');

    process.exit();
  }

  displayCommands() {
    const dotsLength = 30;
    for (const commandName of Object.keys(this.commands)) {
      const command = this.commands[commandName];
      let commandDescription = '';
      for (const flagGroup of command) {
        const commandFlags = `${ flagGroup.long }, ${ flagGroup.short }`;
        const dots = (0, _lodash.repeat)('.', dotsLength - commandFlags.length);
        const optional = flagGroup.isRequired ? '' : _chalk2.default.green('(optional)');
        commandDescription += `  ${ commandFlags } ${ _chalk2.default.dim(dots) } ${ flagGroup.description } ${ optional }\n`;
      }
      const helpStr = _chalk2.default.yellow(commandName) + '\n' + commandDescription;
      console.log(helpStr);
    }
  }

  displayVersion() {
    const str = `
    _______                          _______ __             __
   |_     _.-----.----.--------.    |    ___|  .---.-.-----|  |--.
     |   | |  -__|   _|        |    |    ___|  |  _  |__ --|     |
     |___| |_____|__| |__|__|__|    |___|   |__|___._|_____|__|__|

    version ${ this.version }
    `;
    console.log(_chalk2.default.yellow(str));
  }
}

const cli = new CLI();
cli.getInput(process.argv.slice(2));
cli.runCommand();