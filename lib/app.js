/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

import fs from 'fs';
import app from 'commander';
import { msgStart, msgEnd, msgNoDecks } from '../utils/strings';
import quiz from './quiz';
import config from '../config';

/*
-----------------------------------------------------------------------------------
|
| App setup
|
-----------------------------------------------------------------------------------
*/

app
  .version('1.0.0')
  .option('-d, --deck <string>', 'specify name of deck')
  .option('-n, --number [integer]', 'specify number of questions', config.defaults.numberOfQuestions);

app
  .command('add <card>', 'add new question')
  .option('-d, --deck <string>', 'specify name of deck to add question to')
  .option('-q, --question <string>', 'text of question')
  .option('-a, --answer <string>', 'answer for question')
  .action(function() {
    console.log('Added card!');
    process.exit();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

app.parse(process.argv);

// Extract the specified deck and number of questions
const { deck, number } = app;

// Check if the user has any decks
var decks = fs.readdirSync(config.deckDir);
decks = decks.filter(d => { return d.indexOf('.json') !== -1; });
if (decks.length === 1) {
  console.log(msgNoDecks());
  process.exit();
}

// Display help if no deck is specified
if (!deck) app.help();

fs.stat(`${config.deckDir}${deck}.json`, (err, stat) => {
  if (err && err.code === 'ENOENT') {
    console.log(`The deck: "${deck}" does not exists. Please check the "decks" directory.`);
  } else {
    console.log(msgStart(deck, number));
    const deckContent = JSON.parse(fs.readFileSync(`${config.deckDir}${deck}.json`, 'utf8'));
    quiz(deckContent, number, () => {
      console.log(msgEnd());
      process.exit();
    });
  }
});
