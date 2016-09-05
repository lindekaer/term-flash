/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

import promisifyNode from 'promisify-node';
import app from 'commander';
import {
  msgStart,
  msgEnd,
  msgNoDecks,
  msgAddedToDeck,
  msgHelp,
  msgDeckNotExist
} from '../utils/strings';
import { startQuiz, addQuizQuestion } from './quiz';
import config from '../config';
const fs = promisifyNode('fs');

/*
-----------------------------------------------------------------------------------
|
| App setup
|
-----------------------------------------------------------------------------------
*/

app.version('1.0.0');

app
  .command('quiz <deck>')
  .description('start a quiz')
  .option('-n, --number_of_questions [number]', 'specify number of questions for quiz')
  .action(async function(deck, options) {
    const number = options.number_of_questions || config.defaults.numberOfQuestions;
    try {
      // Check if user has any decks
      const decks = await fs.readdir(config.deckDir);
      const decksType = decks.filter(d => { return d.indexOf('.json') !== -1; });
      const decksName = decks.filter(d => { return d.indexOf(`${deck}.json`) !== -1; });
      if (decksType.length === 0) {
        console.log(msgNoDecks());
        process.exit();
      }
      if (decksName.length === 0) {
        console.log(msgDeckNotExist(deck));
        process.exit();
      }
      const deckContent = await JSON.parse(fs.readFileSync(`${config.deckDir}${deck}.json`, 'utf8'));
      console.log(msgStart(deck, number > deckContent.length ? deckContent.length : number));
      startQuiz(deckContent, number, () => {
        console.log(msgEnd());
        process.exit();
      });
    } catch (err) {
      console.log(err);
    }
  });

app
  .command('add <deck> <question> <answer>')
  .description('add new card to a deck')
  .action(function(deck, question, answer) {
    return addQuizQuestion(deck, question, answer, () => {
      console.log(msgAddedToDeck(deck, question, answer));
      process.exit();
    });
  });

app
  .on('--help', function() {
    console.log(msgHelp());
  });

app.parse(process.argv);
