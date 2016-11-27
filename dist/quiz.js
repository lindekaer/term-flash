'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOptions = exports.runAdd = exports.runQuiz = undefined;

/*
-----------------------------------------------------------------------------------
|
| Quiz logic
|
-----------------------------------------------------------------------------------
*/

let runQuiz = (() => {
  var _ref = _asyncToGenerator(function* (deckName, numQuestions) {
    const decks = yield fs.readdir(config.deckDir);
    const decksType = decks.filter(function (d) {
      return d.indexOf('.json') !== -1;
    });
    const decksName = decks.filter(function (d) {
      return d.indexOf(`${ deckName }.json`) !== -1;
    });
    if (decksType.length === 0) {
      console.log(`You need a ".json" deck in ${ config.deckDir }`);process.exit();
    }
    if (decksName.length === 0) {
      console.log(`You don\'t have a deck called "${ deckName }" in ${ config.deckDir }`);process.exit();
    }
    const deckContent = yield JSON.parse(fs.readFileSync(`${ config.deckDir }/${ deckName }.json`, 'utf8'));

    // If no question limit has been set, make it the length of deck
    numQuestions = deckContent.length;

    yield startQuiz(deckContent, deckName, numQuestions);

    process.exit();
  });

  return function runQuiz(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let runAdd = (() => {
  var _ref2 = _asyncToGenerator(function* (deckName, question, answer) {
    const decks = yield fs.readdir(config.deckDir);
    const decksName = decks.filter(function (d) {
      return d.indexOf(`${ deckName }.json`) !== -1;
    });
    if (decksName.length === 0) {
      console.log(`You don\'t have a deck called "${ deckName }" in ${ config.deckDir }`);process.exit();
    }
    const file = yield fs.readFile(`${ config.deckDir }/${ deckName }.json`);
    const json = JSON.parse(file.toString());
    json.push({
      q: question,
      a: answer
    });
    yield fs.writeFile(`${ config.deckDir }/${ deckName }.json`, new Buffer(JSON.stringify(json, null, 2)));
    // Print the success message
    console.log(`
  This question was added to the deck "${ deckName }":

  ${ _chalk2.default.green(`
  {
    q: "${ question }",
    a: "${ answer }"
  }
  `) }
  `);

    process.exit();
  });

  return function runAdd(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();

let runOptions = (() => {
  var _ref3 = _asyncToGenerator(function* (newPath) {
    const file = yield fs.readFile(_path2.default.join(__dirname, '..', 'config.json'), 'utf-8');
    const json = JSON.parse(file);
    // Set new path
    json.deckDir = newPath;
    yield fs.writeFile(_path2.default.join(__dirname, '..', 'config.json'), new Buffer(JSON.stringify(json, null, 2)));
    console.log(`
  Directory for decks has been changed to "${ _chalk2.default.yellow(newPath) }". Please place your JSON decks there.
  `);
    process.exit();
  });

  return function runOptions(_x6) {
    return _ref3.apply(this, arguments);
  };
})();

/*
-----------------------------------------------------------------------------------
|
| Quiz logic
|
-----------------------------------------------------------------------------------
*/

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           -----------------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Imports
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           -----------------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */

const fs = (0, _promisifyNode2.default)('fs');function startQuiz(deckContent, deckName, numQuestions) {
  return new Promise((resolve, reject) => {
    // Print the start message
    console.log(`
    Starting quiz with ${ _chalk2.default.green(numQuestions) } questions from deck "${ _chalk2.default.green(deckName) }"
    Hit ENTER to step through the quiz!`);

    const deck = (0, _lodash.shuffle)(deckContent);
    const limit = numQuestions;
    let counter = 0;
    let isQuestion;

    // Print initial question
    console.log(`\n-------- ${ counter + 1 } of ${ limit } --------`);
    console.log(`Q: ${ _chalk2.default.yellow(deck[counter].q) }`);
    isQuestion = true;

    // Data event is fired when user hits ENTER
    process.stdin.on('data', () => {
      // Check if quiz has ended
      if (counter >= (limit || deck.length)) return resolve();

      if (isQuestion) {
        console.log(`A: ${ _chalk2.default.green(deck[counter].a) }`);
        isQuestion = false;
        counter++;
      } else {
        console.log(`\n-------- ${ counter + 1 } of ${ numQuestions } --------`);
        console.log(`Q: ${ _chalk2.default.yellow(deck[counter].q) }`);
        isQuestion = true;
      }
    });
  });
}

/*
-----------------------------------------------------------------------------------
|
| Exports
|
-----------------------------------------------------------------------------------
*/

exports.runQuiz = runQuiz;
exports.runAdd = runAdd;
exports.runOptions = runOptions;