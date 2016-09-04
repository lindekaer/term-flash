/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

import chalk from 'chalk';
import { shuffle } from '../utils/helpers';

/*
-----------------------------------------------------------------------------------
|
| Quiz logic
|
-----------------------------------------------------------------------------------
*/

export default function quiz(deck, number, cb) {
  deck = shuffle(deck);
  const limit = number > deck.length ? deck.length : number;
  let counter = 0;
  let isQuestion;

  // Print initial question
  console.log(`\n-------- ${counter + 1} of ${limit} --------`);
  console.log(`Q: ${chalk.yellow(deck[counter].q)}`);
  isQuestion = true;

  process.stdin.on('data', () => {
    // Check if quiz has ended
    if (counter >= (limit || deck.length)) cb();

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
