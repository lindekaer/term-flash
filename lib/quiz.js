/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

import promisifyNode from 'promisify-node';
import chalk from 'chalk';
import { shuffle } from '../utils/helpers';
import config from '../config';
const fs = promisifyNode('fs');

/*
-----------------------------------------------------------------------------------
|
| Quiz logic
|
-----------------------------------------------------------------------------------
*/

export function startQuiz(deck, number, cb) {
  deck = shuffle(deck);
  const limit = number;
  let counter = 0;
  let isQuestion;

  // Print initial question
  console.log(`\n-------- ${counter + 1} of ${limit} --------`);
  console.log(`Q: ${chalk.yellow(deck[counter].q)}`);
  isQuestion = true;

  // Data event is fired when user hits ENTER
  process.stdin.on('data', () => {
    // Check if quiz has ended
    if (counter >= (limit || deck.length)) return cb();

    if (isQuestion) {
      console.log(`A: ${chalk.green(deck[counter].a)}`);
      isQuestion = false;
      counter++;
    } else {
      console.log(`\n-------- ${counter + 1} of ${number} --------`);
      console.log(`Q: ${chalk.yellow(deck[counter].q)}`);
      isQuestion = true;
    }
  });
}

// export
export async function addQuizQuestion(deck, question, answer, cb) {
  try {
    const file = await fs.readFile(`${config.deckDir}${deck}.json`);
    const json = JSON.parse(file.toString());
    json.push({
      q: question,
      a: answer
    });
    await fs.writeFile(`${config.deckDir}${deck}.json`, new Buffer(JSON.stringify(json, null, 2)));
    cb();
  } catch (err) {
    console.err(err);
  }
}
